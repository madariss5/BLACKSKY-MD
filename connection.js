const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const logger = require('./utils/logger');
const pino = require('pino');
const fs = require('fs');
const path = require('path');


class WhatsAppConnection {
    constructor() {
        this.sock = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.initializeSessionsDirectory();
    }

    initializeSessionsDirectory() {
        const sessionsDir = process.env.SESSIONS_DIR || 'sessions';
        if (!fs.existsSync(sessionsDir)) {
            fs.mkdirSync(sessionsDir, { recursive: true });
            logger.info(`Created sessions directory: ${sessionsDir}`);
        }
    }

    async connect() {
        try {
            logger.info('Initializing WhatsApp connection...');
            const { state, saveCreds } = await useMultiFileAuthState('sessions');

            this.sock = makeWASocket({
                printQRInTerminal: true,
                auth: state,
                logger: pino({ level: 'silent' }),
                browser: ['Chrome (Linux)', '', ''],
            });

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    logger.info('Connected to WhatsApp');
                    this.retryCount = 0;
                    await this.sendInitialMessage();
                }
                else if (connection === 'close') {
                    const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
                    logger.info('Connection closed due to ', lastDisconnect?.error?.message);

                    if (shouldReconnect && this.retryCount < this.maxRetries) {
                        this.retryCount++;
                        logger.info(`Reconnecting... Attempt ${this.retryCount}`);
                        this.connect();
                    }
                }
            });

            return this.sock;
        } catch (error) {
            logger.error('Failed to connect:', error);
            throw error;
        }
    }

    async sendInitialMessage() {
        if (!this.sock?.user?.id) return;

        try {
            await this.sock.sendMessage(this.sock.user.id, {
                text: '🤖 *WhatsApp Bot Connected!*\n\n' +
                     `• Device: ${this.sock.user.id}\n` +
                     `• Time: ${new Date().toISOString()}\n` +
                     `• Status: Active\n\n` +
                     'Type !help to see available commands'
            });
        } catch (error) {
            logger.error('Failed to send initial message:', error);
        }
    }
}

module.exports = new WhatsAppConnection();