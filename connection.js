const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, makeInMemoryStore } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const logger = require('./utils/logger');
const pino = require('pino');
const fs = require('fs');
const commandHandler = require('./handlers/commandHandler');
const config = require('./config');

class WhatsAppConnection {
    constructor() {
        this.sock = null;
        this.store = makeInMemoryStore({
            logger: pino().child({ level: 'silent', stream: 'store' })
        });
        this.sessionId = process.env.SESSION_ID || `session_${Date.now()}`;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async connect() {
        try {
            logger.info('Initializing WhatsApp connection...');
            const { state, saveCreds } = await useMultiFileAuthState('sessions');

            this.sock = makeWASocket({
                printQRInTerminal: true,
                auth: state,
                logger: pino({ level: 'silent' }), // Reduced logging noise
                browser: ['Chrome (Linux)', '', ''],
                markOnlineOnConnect: true,
                generateHighQualityLinkPreview: true,
                auth: {
                    creds: state.creds,
                    keys: state.keys,
                },
                sessionId: this.sessionId,
                getMessage: async (key) => {
                    try {
                        let jid = key.remoteJid;
                        let msg = await this.store.loadMessage(jid, key.id);
                        return msg?.message || "";
                    } catch (error) {
                        logger.error('Error loading message:', error);
                        return "";
                    }
                }
            });

            this.store.bind(this.sock.ev);

            // Handle messages and commands
            this.sock.ev.on('messages.upsert', async (m) => {
                try {
                    if (m.type === 'notify' && m.messages && m.messages[0]) {
                        const msg = m.messages[0];
                        if (msg.message) {
                            // Store the message
                            this.store.insertMessage(msg);

                            // Process commands
                            const messageText = msg.message?.conversation || 
                                             msg.message?.extendedTextMessage?.text || 
                                             msg.message?.imageMessage?.caption || '';

                            if (messageText.startsWith(config.prefix)) {
                                try {
                                    const args = messageText.slice(config.prefix.length).trim().split(' ');
                                    const command = args.shift().toLowerCase();
                                    logger.info(`Processing command: ${command} with args:`, args);

                                    await commandHandler.handleCommand(this.sock, msg, command, args);
                                } catch (error) {
                                    logger.error('Error processing command:', error);
                                    await this.sock.sendMessage(msg.key.remoteJid, { 
                                        text: '❌ Error processing command. Please try again.' 
                                    }).catch(err => logger.error('Error sending error message:', err));
                                }
                            }
                        }
                    }
                } catch (error) {
                    logger.error('Error in messages.upsert handler:', error);
                }
            });

            // Handle credentials update
            this.sock.ev.on('creds.update', async () => {
                try {
                    logger.info('Credentials updated, saving...');
                    await saveCreds();
                    logger.info(`Session ID: ${this.sessionId} credentials updated`);
                } catch (error) {
                    logger.error('Error saving credentials:', error);
                }
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
                    logger.info(`Connected to WhatsApp with Session ID: ${this.sessionId}`);
                    this.reconnectAttempts = 0; // Reset reconnection attempts on successful connection
                    await this.sendInitialMessage();
                }

                if (connection === 'close') {
                    const shouldReconnect = 
                        lastDisconnect?.error?.output?.statusCode !== 403 && 
                        this.reconnectAttempts < this.maxReconnectAttempts;

                    logger.warn('Connection closed. Reason:', lastDisconnect?.error?.message || 'Unknown');

                    if (shouldReconnect) {
                        this.reconnectAttempts++;
                        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff
                        logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay/1000}s...`);

                        setTimeout(async () => {
                            try {
                                await this.connect();
                            } catch (error) {
                                logger.error('Reconnection attempt failed:', error);
                            }
                        }, delay);
                    } else {
                        logger.error('Connection terminated. Max reconnection attempts reached or authentication failed.');
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
                            `• Session ID: ${this.sessionId}\n` +
                            `• Time: ${new Date().toISOString()}\n` +
                            `• Status: Active\n\n` +
                            `Type ${config.prefix}help to see available commands`;

            logger.info('Sending initial connection message');
            await this.sock.sendMessage(this.sock.user.id, { text: sessionInfo });

            // Send session file if debug is enabled
            if (process.env.ENABLE_SESSION_DEBUG === 'true') {
                try {
                    let sessionData = fs.readFileSync('./sessions/creds.json');
                    await this.sock.sendMessage(this.sock.user.id, { 
                        document: sessionData, 
                        mimetype: 'application/json', 
                        fileName: `session_${this.sessionId}.json`
                    });
                } catch (error) {
                    logger.error('Error sending debug session file:', error);
                }
            }
        } catch (error) {
            logger.error('Failed to send initial message:', error);
        }
    }

    // Method to clean up resources
    async disconnect() {
        try {
            if (this.sock) {
                await this.sock.logout();
                await this.sock.end();
                this.sock = null;
                logger.info('WhatsApp connection closed and cleaned up');
            }
        } catch (error) {
            logger.error('Error during disconnect:', error);
        }
    }
}

module.exports = new WhatsAppConnection();