const connection = require('./connection');
const commandHandler = require('./handlers/commandHandler');
const logger = require('./utils/logger');
const fs = require('fs');

async function startBot() {
    try {
        // Ensure database directory exists
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
            logger.info('Created database directory');
        }

        // Ensure required database files exist
        const requiredFiles = ['bans.json', 'warnings.json'];
        requiredFiles.forEach(file => {
            const filePath = `./database/${file}`;
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '{}');
                logger.info(`Created database file: ${file}`);
            }
        });

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

        // Handle graceful shutdown
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