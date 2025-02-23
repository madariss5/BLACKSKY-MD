const connection = require('./connection');
const commandHandler = require('./handlers/commandHandler');
const logger = require('./utils/logger');

async function startBot() {
    try {
        // You can provide a phone number here for pairing code authentication
        // e.g., const phoneNumber = '+1234567890';
        const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '';
        const sock = await connection.connect(phoneNumber);

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];

            if (!msg.key.fromMe) {
                await commandHandler.handleMessage(sock, msg);
            }
        });

    } catch (error) {
        logger.error('Failed to start bot:', error);
        process.exit(1);
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
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Promise Rejection:', error);
});

startBot();