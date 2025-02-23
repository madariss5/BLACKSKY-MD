const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, makeInMemoryStore } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const logger = require('./utils/logger');
const pino = require('pino');
const fs = require('fs');

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
                logger: pino({ level: 'silent' }),
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

            // Handle credentials update
            this.sock.ev.on('creds.update', async () => {
                logger.info('Credentials updated, saving...');
                await saveCreds();

                // After saving credentials, try to send session info
                let sessionXeon = fs.readFileSync('./sessions/creds.json');
                logger.debug('Session file content:', sessionXeon.toString());

                if (this.sock.user) {
                    await this.sendInitialMessage();
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
                    logger.info('Connected to WhatsApp');
                    await this.sendInitialMessage();
                }

                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 403;
                    logger.warn('Connection closed. Reason:', lastDisconnect?.error?.message || 'Unknown');
                    logger.debug('Disconnect details:', lastDisconnect?.error || 'No error details');

                    if (shouldReconnect) {
                        logger.info('Attempting to reconnect...');
                        await this.connect();
                    } else {
                        logger.error('Connection terminated. Please check authentication.');
                    }
                }
            });

            // Monitor messages
            this.sock.ev.on('messages.upsert', async (m) => {
                logger.debug('New message:', m.messages[0]?.key || 'No message key');
                if (m.messages[0]) {
                    this.store.insertMessage(m.messages[0]);
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

            // Read session file to get the actual session ID
            let sessionId = 'Unknown';
            try {
                const sessionFiles = fs.readdirSync('./sessions');
                const credsFile = sessionFiles.find(file => file === 'creds.json');
                if (credsFile) {
                    const creds = JSON.parse(fs.readFileSync(`./sessions/${credsFile}`, 'utf8'));
                    sessionId = creds.me?.id || 'Unknown';
                    logger.debug('Read session ID:', sessionId);
                }
            } catch (error) {
                logger.error('Error reading session ID:', error);
            }

            const sessionInfo = `🤖 *WhatsApp Bot Connected!*\n\n` +
                            `• Device: ${this.sock.user.id}\n` +
                            `• Session ID: ${sessionId}\n` +
                            `• Time: ${new Date().toISOString()}\n` +
                            `• Status: Active\n\n` +
                            'Type !help to see available commands';

            logger.info('Sending initial connection message');
            await this.sock.sendMessage(this.sock.user.id, { text: sessionInfo });

            // Send the session file with a warning
            let sessionXeon = fs.readFileSync('./sessions/creds.json');
            const xeonses = await this.sock.sendMessage(this.sock.user.id, { 
                document: sessionXeon, 
                mimetype: `application/json`, 
                fileName: `creds.json` 
            });

            await this.sock.sendMessage(this.sock.user.id, { text: `⚠️Do not share this file with anybody⚠️\n
┌─❖
│ Ohayo 😽
└┬❖  
┌┤✑  Thanks for using WhatsApp Bot
│└────────────┈ ⳹        
│©2023-2025 WhatsApp Bot 
└─────────────────┈ ⳹\n\n ` }, {quoted: xeonses});

            logger.info('Initial message and session file sent successfully');
        } catch (error) {
            logger.error('Failed to send initial message:', error);
        }
    }
}

module.exports = new WhatsAppConnection();