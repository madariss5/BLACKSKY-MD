const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, PHONENUMBER_MCC } = require('@whiskeysockets/baileys');
const readline = require('readline');
const logger = require('./utils/logger');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const { jidNormalizedUser } = require('@whiskeysockets/baileys');
// Assuming store is defined elsewhere, adjust as needed.  This is required for getMessage
const store = require('./store'); // Or wherever your message store is located


class WhatsAppConnection {
    constructor() {
        this.sock = null;
        this.connectionAttempts = 0;
        this.maxRetries = 5;
        this.retryDelay = 3000;
        this.isConnecting = false;
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        this.initializeSessionsDirectory();
    }

    initializeSessionsDirectory() {
        const sessionsDir = process.env.SESSIONS_DIR || 'sessions';
        if (!fs.existsSync(sessionsDir)) {
            fs.mkdirSync(sessionsDir, { recursive: true });
            logger.info(`Created sessions directory: ${sessionsDir}`);
        }
    }

    async cleanupPreviousConnection() {
        if (this.sock) {
            logger.debug('Cleaning up previous connection...');
            try {
                this.sock.ev.removeAllListeners();
                if (this.sock.ws && this.sock.ws.readyState === this.sock.ws.OPEN) {
                    await this.sock.logout();
                }
            } catch (error) {
                logger.warn('Error during connection cleanup:', error);
            }
            this.sock = null;
        }
    }

    async sendSessionInfo() {
        try {
            if (!this.sock?.user?.id) {
                logger.warn('Cannot send session info: socket or user ID not available');
                return;
            }

            const sessionsDir = process.env.SESSIONS_DIR || 'sessions';
            const credsPath = path.join(sessionsDir, 'creds.json');

            if (!fs.existsSync(credsPath)) {
                logger.warn(`Session file not found at: ${credsPath}`);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 10000));

            try {
                const sessionData = fs.readFileSync(credsPath);
                if (sessionData.length === 0) {
                    logger.warn('Session file is empty');
                    return;
                }

                const xeonses = await this.sock.sendMessage(this.sock.user.id, { 
                    document: sessionData,
                    mimetype: 'application/json',
                    fileName: 'creds.json'
                });

                await this.sock.sendMessage(this.sock.user.id, { 
                    text: `✅ *WhatsApp Session Information* ✅\n\n` +
                         `Session Details:\n` +
                         `• Status: ${this.sock.authState.creds.registered ? 'Registered ✓' : 'Not Registered ✗'}\n` +
                         `• Device ID: ${this.sock.authState.creds.deviceId || 'Not Available'}\n` +
                         `• Platform: ${this.sock.authState.creds.platform || 'Unknown'}\n` +
                         `• Connection: ${this.sock.ws.readyState === this.sock.ws.OPEN ? 'Active ✓' : 'Inactive ✗'}\n` +
                         `• Version: ${this.sock.version?.join('.') || 'Unknown'}\n\n` +
                         `⚡ Security Information ⚡\n` +
                         `• Registration Time: ${new Date().toISOString()}\n` +
                         `• Session Type: ${this.sock.type || 'Unknown'}\n` +
                         `• Browser: Chrome (Linux)\n\n` +
                         `⚠️ IMPORTANT: Keep this session information secure!\n` +
                         `Last Updated: ${new Date().toISOString()}`
                }, { quoted: xeonses });

                logger.info('Session information sent successfully');
            } catch (error) {
                logger.error('Error sending session info:', error);
            }
        } catch (error) {
            logger.error('Failed to process session information:', error);
        }
    }

    setupEventHandlers() {
        this.sock.ev.on('creds.update', async (creds) => {
            try {
                await this.saveCreds(creds);
                logger.info('Credentials updated and saved');
                if (this.sock.authState.creds.registered) {
                    await this.sendSessionInfo();
                }
            } catch (error) {
                logger.error('Failed to save credentials:', error);
            }
        });

        this.sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            logger.debug('Connection status update:', {
                connection,
                lastDisconnect: lastDisconnect?.error?.output?.statusCode,
                attempts: this.connectionAttempts,
                hasQR: !!qr
            });

            if (connection === 'connecting' && !this.isConnecting) {
                this.isConnecting = true;
                logger.info('Connecting to WhatsApp...');
            }
            else if (connection === 'open') {
                this.isConnecting = false;
                logger.info('Connected to WhatsApp');
                this.connectionAttempts = 0;
                await this.handleSuccessfulConnection();
            }
            else if (connection === 'close') {
                this.isConnecting = false;
                await this.handleConnectionClose(lastDisconnect);
            }
        });

        this.sock.ev.on('messages.upsert', async (m) => {
            if (m.type === 'notify') {
                logger.debug('New message received');
            }
        });

        this.sock.ev.on('ws-close', async () => {
            logger.warn('WebSocket connection closed');
        });
    }

    async handleSuccessfulConnection() {
        try {
            logger.info('Setting up successful connection...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            await this.sendSessionInfo();
        } catch (error) {
            logger.error('Error in handling successful connection:', error);
        }
    }

    async handleConnectionClose(lastDisconnect) {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        logger.info('Connection closed. Status code:', statusCode);

        if (shouldReconnect && this.connectionAttempts < this.maxRetries) {
            this.connectionAttempts++;
            const delay = this.retryDelay * Math.pow(2, this.connectionAttempts - 1);

            logger.info(`Attempting reconnection ${this.connectionAttempts}/${this.maxRetries} in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));

            await this.connect();
        } else {
            if (statusCode === DisconnectReason.loggedOut) {
                logger.error('Session logged out. Please scan QR code or use pairing code again.');
            } else {
                logger.error('Connection closed permanently:', lastDisconnect?.error || 'Max retries reached');
            }
        }
    }

    async connect(phoneNumber = '', forceQR = false) {
        try {
            if (this.isConnecting) {
                logger.warn('Connection attempt already in progress');
                return;
            }

            logger.info('Initializing WhatsApp connection...');
            await this.cleanupPreviousConnection();

            const sessionsDir = process.env.SESSIONS_DIR || 'sessions';
            const { state, saveCreds } = await useMultiFileAuthState(sessionsDir);
            this.saveCreds = saveCreds;

            const usePairingCode = !!phoneNumber && !forceQR;

            this.sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                logger: pino({ level: 'silent' }),
                printQRInTerminal: !usePairingCode,
                mobile: false,
                browser: ['Chrome (Linux)', '', ''],
                markOnlineOnConnect: true,
                generateHighQualityLinkPreview: true,
                defaultQueryTimeoutMs: undefined,
                connectTimeoutMs: 60000,
                retryRequestDelayMs: 5000,
                qrTimeout: 40000,
                maxRetries: 5,
                getMessage: async (key) => {
                    let jid = jidNormalizedUser(key.remoteJid)
                    let msg = await store.loadMessage(jid, key.id)
                    return msg?.message || ""
                }
            });

            this.setupEventHandlers();

            if (usePairingCode && !this.sock.authState.creds.registered) {
                await this.handlePairingCode(phoneNumber);
            }

            return this.sock;
        } catch (error) {
            logger.error('Connection error:', error);
            throw error;
        }
    }

    async handlePairingCode(phoneNumber) {
        try {
            const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');

            if (!Object.keys(PHONENUMBER_MCC).some(v => formattedNumber.startsWith(v))) {
                throw new Error('Invalid phone number format. Please include country code (e.g., +1234567890)');
            }

            logger.info('Requesting pairing code...');
            setTimeout(async () => {
                try {
                    const code = await this.sock.requestPairingCode(formattedNumber);
                    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
                    logger.info(`Your Pairing Code: ${formattedCode}`);
                } catch (error) {
                    logger.error('Failed to get pairing code:', error);
                }
            }, 3000);
        } catch (error) {
            logger.error('Error handling pairing code:', error);
            throw error;
        }
    }

    async question(text) {
        return new Promise((resolve) => this.rl.question(text, resolve));
    }
}

module.exports = new WhatsAppConnection();