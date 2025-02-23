const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, makeInMemoryStore } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const logger = require('./utils/logger');
const pino = require('pino');
const fs = require('fs');
const commandHandler = require('./handlers/commandHandler');

class WhatsAppConnection {
    constructor() {
        this.sock = null;
        this.store = makeInMemoryStore({
            logger: pino().child({ level: 'silent', stream: 'store' })
        });
    }

    async connect() {
        try {
            logger.info('Initializing WhatsApp connection...');
            const { state, saveCreds } = await useMultiFileAuthState('sessions');

            this.sock = makeWASocket({
                printQRInTerminal: true,
                auth: state,
                logger: pino({ level: 'debug' }), // Changed to debug for more verbose logging
                browser: ['Chrome (Linux)', '', ''],
                markOnlineOnConnect: true,
                generateHighQualityLinkPreview: true,
                getMessage: async (key) => {
                    let jid = key.remoteJid;
                    let msg = await this.store.loadMessage(jid, key.id);
                    return msg?.message || "";
                }
            });

            this.store.bind(this.sock.ev);

            // Handle messages and commands
            this.sock.ev.on('messages.upsert', async (m) => {
                logger.debug('New message received:', m.messages[0]);

                if (m.type === 'notify' && m.messages && m.messages[0]) {
                    const msg = m.messages[0];
                    if (msg.message) {
                        // Store the message
                        this.store.insertMessage(msg);

                        // Process commands
                        const messageText = msg.message?.conversation || 
                                         msg.message?.extendedTextMessage?.text || 
                                         msg.message?.imageMessage?.caption || '';

                        if (messageText.startsWith('!')) {
                            try {
                                const args = messageText.slice(1).trim().split(' ');
                                const command = args.shift().toLowerCase();
                                logger.info(`Processing command: ${command} with args:`, args);

                                await commandHandler.handleCommand(this.sock, msg, command, args);
                            } catch (error) {
                                logger.error('Error processing command:', error);
                                await this.sock.sendMessage(msg.key.remoteJid, { 
                                    text: '❌ Error processing command. Please try again.' 
                                });
                            }
                        }
                    }
                }
            });

            // Handle credentials update
            this.sock.ev.on('creds.update', async () => {
                logger.info('Credentials updated, saving...');
                await saveCreds();
            });

            // Handle connection updates
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                logger.debug('Connection update:', update);

                if (qr) {
                    logger.info('QR Code received. Scan with WhatsApp to connect:');
                    qrcode.generate(qr, { small: true });
                }

                if (connection === 'open') {
                    logger.info('Connected to WhatsApp');
                    await this.sendInitialMessage();
                }

                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 403;
                    logger.warn('Connection closed. Reason:', lastDisconnect?.error?.message || 'Unknown');
                    logger.debug('Disconnect details:', lastDisconnect?.error || 'No error details');

                    if (shouldReconnect) {
                        logger.info('Attempting to reconnect...');
                        setTimeout(async () => {
                            await this.connect();
                        }, 3000);
                    } else {
                        logger.error('Connection terminated. Please check authentication.');
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
        try {
            if (!this.sock?.user?.id) {
                logger.warn('User ID not available, skipping initial message');
                return;
            }

            const sessionInfo = `🤖 *WhatsApp Bot Connected!*\n\n` +
                            `• Device: ${this.sock.user.id}\n` +
                            `• Time: ${new Date().toISOString()}\n` +
                            `• Status: Active\n\n` +
                            'Type !help to see available commands';

            logger.info('Sending initial connection message');
            await this.sock.sendMessage(this.sock.user.id, { text: sessionInfo });
        } catch (error) {
            logger.error('Failed to send initial message:', error);
        }
    }
}

module.exports = new WhatsAppConnection();