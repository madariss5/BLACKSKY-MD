const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, PHONENUMBER_MCC } = require('@whiskeysockets/baileys');
const readline = require('readline');
const logger = require('./utils/logger');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

class WhatsAppConnection {
    constructor() {
        this.sock = null;
        this.connectionAttempts = 0;
        this.maxRetries = 5;
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        // Ensure sessions directory exists
        const sessionsDir = process.env.SESSIONS_DIR || 'sessions';
        if (!fs.existsSync(sessionsDir)) {
            fs.mkdirSync(sessionsDir, { recursive: true });
            logger.info(`Created sessions directory: ${sessionsDir}`);
        }
    }

    async sendSessionInfo() {
        try {
            logger.debug('Checking prerequisites for sending session info...');

            if (!this.sock?.user?.id) {
                logger.error('Cannot send session info: socket or user ID not available');
                return;
            }

            const sessionsDir = process.env.SESSIONS_DIR || 'sessions';
            const credsPath = path.join(sessionsDir, 'creds.json');

            logger.debug(`Checking session file at: ${credsPath}`);

            // Ensure file exists and is readable
            if (!fs.existsSync(credsPath)) {
                logger.error(`Session file not found at: ${credsPath}`);
                return;
            }

            // Wait longer for the connection to stabilize
            logger.debug('Waiting for connection to stabilize...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            try {
                // Read and verify session data
                const sessionData = fs.readFileSync(credsPath);
                logger.debug(`Read session file (${sessionData.length} bytes)`);

                if (sessionData.length === 0) {
                    logger.error('Session file is empty');
                    return;
                }

                // Send the session file first
                logger.debug('Sending session file...');
                await this.sock.sendMessage(this.sock.user.id, { 
                    document: sessionData,
                    mimetype: 'application/json',
                    fileName: 'creds.json'
                });
                logger.debug('Session file sent successfully');

                // Wait a bit before sending the warning message
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Send warning message
                logger.debug('Sending warning message...');
                await this.sock.sendMessage(this.sock.user.id, { 
                    text: `⚠️ *WhatsApp Session File* ⚠️\n\n` +
                         `Your session file has been generated and sent above.\n` +
                         `⚡ Important Security Notice ⚡\n` +
                         `• DO NOT share this file\n` +
                         `• Keep it secure\n` +
                         `• It contains your login credentials\n\n` +
                         `Session ID: ${this.sock.authState.creds.noiseKey?.private ? '✓' : '✗'}`
                });

                logger.info('Session information sent successfully');
            } catch (error) {
                logger.error('Error during message sending:', {
                    name: error.name,
                    message: error.message,
                    code: error.code
                });
                throw error; // Re-throw to be caught by outer try-catch
            }
        } catch (error) {
            logger.error('Failed to send session information:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
    }

    async question(text) {
        return new Promise((resolve) => this.rl.question(text, resolve));
    }

    async connect(phoneNumber = '', forceQR = false) {
        try {
            logger.debug('Starting WhatsApp connection process...');
            logger.debug(`Phone number provided: ${phoneNumber ? 'Yes' : 'No'}`);
            logger.debug(`Force QR: ${forceQR}`);

            const sessionsDir = process.env.SESSIONS_DIR || 'sessions';
            const { state, saveCreds } = await useMultiFileAuthState(sessionsDir);
            const usePairingCode = !!phoneNumber && !forceQR;

            logger.debug('Creating WhatsApp socket connection...');
            const baileysLogger = pino({ level: 'silent' });

            this.sock = makeWASocket({
                auth: state,
                printQRInTerminal: !usePairingCode,
                mobile: false,
                logger: baileysLogger,
                browser: ['Chrome (Linux)', '', ''],
                markOnlineOnConnect: true,
                generateHighQualityLinkPreview: true,
                defaultQueryTimeoutMs: undefined
            });

            // Handle connection updates
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;
                logger.debug('Connection status update:', { 
                    connection, 
                    lastDisconnect: lastDisconnect?.error?.output,
                    attempts: this.connectionAttempts
                });

                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    logger.info('Connection closed. Reason:', lastDisconnect?.error?.output || 'Unknown');

                    if (shouldReconnect && this.connectionAttempts < this.maxRetries) {
                        logger.info(`Reconnecting... Attempt ${this.connectionAttempts + 1}/${this.maxRetries}`);
                        this.connectionAttempts++;
                        await this.connect(phoneNumber, forceQR);
                    } else {
                        logger.error('Connection closed permanently:', lastDisconnect?.error || 'Max retries reached');
                    }
                } else if (connection === 'open') {
                    logger.info('Successfully connected to WhatsApp');
                    this.connectionAttempts = 0;
                    await this.sendSessionInfo();
                }
            });

            this.sock.ev.on('creds.update', saveCreds);

            if (usePairingCode && !this.sock.authState.creds.registered) {
                let formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
                logger.debug('Formatting phone number for pairing code:', formattedNumber);

                if (!Object.keys(PHONENUMBER_MCC).some(v => formattedNumber.startsWith(v))) {
                    throw new Error('Invalid phone number format. Please include country code (e.g., +1234567890)');
                }

                setTimeout(async () => {
                    try {
                        logger.debug('Requesting pairing code...');
                        let code = await this.sock.requestPairingCode(formattedNumber);
                        code = code?.match(/.{1,4}/g)?.join("-") || code;
                        logger.info(`Your Pairing Code: ${code}`);
                    } catch (error) {
                        logger.error('Failed to request pairing code:', error);
                        throw error;
                    }
                }, 3000);
            } else if (!usePairingCode) {
                logger.info('Using QR code authentication. Please scan the QR code above with your WhatsApp app.');
            }

            return this.sock;
        } catch (error) {
            logger.error('Connection error:', error);
            throw error;
        }
    }
}

module.exports = new WhatsAppConnection();