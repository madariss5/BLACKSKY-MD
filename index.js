const connection = require('./connection');
const commandHandler = require('./handlers/commandHandler');
const logger = require('./utils/logger');

async function startBot() {
    try {
        logger.info('Starting WhatsApp bot...');
        const sock = await connection.connect();

        sock.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const msg = messages[0];
                if (!msg.key.fromMe) {
                    await commandHandler.handleMessage(sock, msg);
                }
            } catch (error) {
                logger.error('Error processing message:', error);
            }
        });

        // Keep the process alive
        process.on('SIGINT', () => {
            logger.info('Bot shutting down...');
            process.exit(0);
        });

    } catch (error) {
        logger.error('Failed to start bot:', error);
        process.exit(1);
    }
}

logger.info('Initializing WhatsApp bot...');
startBot();