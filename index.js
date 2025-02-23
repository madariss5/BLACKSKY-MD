const connection = require('./connection');
const commandHandler = require('./handlers/commandHandler');
const logger = require('./utils/logger');

async function startBot() {
    try {
        logger.info('Starting WhatsApp bot...');

        // Get phone number from environment variable
        const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '';
        logger.debug('Using phone number from environment:', phoneNumber || 'None provided');

        // Get authentication method from environment variable
        const useQR = !phoneNumber || process.env.FORCE_QR === 'true';
        logger.debug(`Authentication method: ${useQR ? 'QR Code' : 'Pairing Code'}`);

        // Set up sessions directory based on environment
        process.env.SESSIONS_DIR = process.env.SESSIONS_DIR || 'sessions';
        logger.debug(`Using sessions directory: ${process.env.SESSIONS_DIR}`);

        const sock = await connection.connect(phoneNumber, useQR);
        logger.debug('WhatsApp socket connection established');

        sock.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const msg = messages[0];
                logger.debug('Received message:', {
                    fromMe: msg.key.fromMe,
                    remoteJid: msg.key.remoteJid,
                    messageType: Object.keys(msg.message || {})[0]
                });

                if (!msg.key.fromMe) {
                    await commandHandler.handleMessage(sock, msg);
                }
            } catch (error) {
                logger.error('Error processing message:', error);
            }
        });

        // For Heroku deployment - keep the process alive
        if (process.env.NODE_ENV === 'production') {
            const express = require('express');
            const app = express();
            const port = process.env.PORT || 5000;

            app.get('/', (req, res) => {
                res.send('WhatsApp Bot is running!');
            });

            app.listen(port, '0.0.0.0', () => {
                logger.info(`Server is running on port ${port}`);
            });
        }

    } catch (error) {
        logger.error('Failed to start bot:', error);
        if (error.message.includes('Invalid phone number')) {
            logger.info('Please provide a valid phone number with country code (e.g., +1234567890)');
        }
        // Don't exit process on Heroku
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

// Handle process termination
process.on('SIGINT', () => {
    logger.info('Bot shutting down...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    if (error.message.includes('Invalid phone number')) {
        logger.info('Please provide a valid phone number with country code (e.g., +1234567890)');
    }
    // Don't exit process on Heroku
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Promise Rejection:', error);
    // Don't exit process on Heroku
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

logger.info('Initializing WhatsApp bot...');
startBot();