const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, PHONENUMBER_MCC } = require('@whiskeysockets/baileys');
const readline = require('readline');
const logger = require('./utils/logger');
const pino = require('pino');

class WhatsAppConnection {
    constructor() {
        this.sock = null;
        this.connectionAttempts = 0;
        this.maxRetries = 5;
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    }

    async question(text) {
        return new Promise((resolve) => this.rl.question(text, resolve));
    }

    async connect(phoneNumber = '') {
        try {
            const { state, saveCreds } = await useMultiFileAuthState('sessions');
            const usePairingCode = !!phoneNumber;

            // Configure logger for Baileys
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

            // Bind events
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    logger.info('Connection closed. Reason:', lastDisconnect?.error?.output || 'Unknown');

                    if (shouldReconnect && this.connectionAttempts < this.maxRetries) {
                        logger.info('Reconnecting to WhatsApp...');
                        this.connectionAttempts++;
                        await this.connect(phoneNumber);
                    } else {
                        logger.error('Connection closed permanently:', lastDisconnect?.error || 'Max retries reached');
                    }
                } else if (connection === 'open') {
                    logger.info('Connected to WhatsApp');
                    this.connectionAttempts = 0;
                }
            });

            this.sock.ev.on('creds.update', saveCreds);

            // Handle pairing code if phone number is provided
            if (usePairingCode && !this.sock.authState.creds.registered) {
                let formattedNumber = phoneNumber.replace(/[^0-9]/g, '');

                if (!Object.keys(PHONENUMBER_MCC).some(v => formattedNumber.startsWith(v))) {
                    throw new Error('Invalid phone number format. Please include country code (e.g., +1234567890)');
                }

                // Request pairing code
                setTimeout(async () => {
                    try {
                        let code = await this.sock.requestPairingCode(formattedNumber);
                        code = code?.match(/.{1,4}/g)?.join("-") || code;
                        logger.info(`Your Pairing Code: ${code}`);
                    } catch (error) {
                        logger.error('Failed to request pairing code:', error);
                        throw error;
                    }
                }, 3000);
            }

            return this.sock;
        } catch (error) {
            logger.error('Connection error:', error);
            throw error;
        }
    }
}

module.exports = new WhatsAppConnection();