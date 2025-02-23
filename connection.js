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
            const baileysLogger = pino({ 
                level: 'silent',
                transport: {
                    target: 'pino-pretty',
                    options: {
                        translateTime: "SYS:standard",
                        ignore: "pid,hostname"
                    }
                }
            });

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

            // Bind events
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                logger.debug('Connection status update:', { 
                    connection, 
                    lastDisconnect: lastDisconnect?.error?.output,
                    qrReceived: !!qr
                });

                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    logger.info('Connection closed. Reason:', lastDisconnect?.error?.output || 'Unknown');

                    if (shouldReconnect && this.connectionAttempts < this.maxRetries) {
                        logger.info(`Reconnecting to WhatsApp... Attempt ${this.connectionAttempts + 1}/${this.maxRetries}`);
                        this.connectionAttempts++;
                        await this.connect(phoneNumber, forceQR);
                    } else {
                        logger.error('Connection closed permanently:', lastDisconnect?.error || 'Max retries reached');
                    }
                } else if (connection === 'open') {
                    logger.info('Successfully connected to WhatsApp');
                    this.connectionAttempts = 0;

                    // Send session ID to chat
                    try {
                        const credsPath = path.join(sessionsDir, 'creds.json');
                        const sessionData = fs.readFileSync(credsPath);
                        const sessionInfo = JSON.parse(sessionData);

                        const sessionMessage = `🔐 *Session Information*\n\n` +
                            `Device ID: ${sessionInfo.noiseKey?.private ? '✅ Generated' : '❌ Missing'}\n` +
                            `Signal Creds: ${sessionInfo.signedIdentityKey?.private ? '✅ Valid' : '❌ Invalid'}\n` +
                            `Registration: ${sessionInfo.registered ? '✅ Complete' : '❌ Incomplete'}\n\n` +
                            `_Keep this information safe!_`;

                        await this.sock.sendMessage(this.sock.user.id, { text: sessionMessage });
                        logger.info('Sent session information to user chat');
                    } catch (error) {
                        logger.error('Failed to send session information:', error);
                    }
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