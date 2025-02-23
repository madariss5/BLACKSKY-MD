const connection = require('./connection');
const commandHandler = require('./handlers/commandHandler');
const logger = require('./utils/logger');
const fs = require('fs');
const lang = require('./utils/languageHandler'); // Added languageHandler import

async function initializeDatabase() {
    try {
        // Ensure database directory exists
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
            logger.info('Created database directory');
        }

        // Initialize required database files with default empty JSON objects
        const requiredFiles = ['bans.json', 'warnings.json'];
        for (const file of requiredFiles) {
            const filePath = `./database/${file}`;
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '{}', 'utf8');
                logger.info(`Created database file: ${file}`);
            }
        }

        // Verify files are readable and contain valid JSON
        for (const file of requiredFiles) {
            const filePath = `./database/${file}`;
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                JSON.parse(content);
                logger.info(`Verified database file: ${file}`);
            } catch (error) {
                logger.error(`Error verifying ${file}:`, error);
                // Reset file with empty JSON object if corrupted
                fs.writeFileSync(filePath, '{}', 'utf8');
                logger.info(`Reset corrupted database file: ${file}`);
            }
        }
    } catch (error) {
        logger.error('Failed to initialize database:', error);
        throw error;
    }
}

async function startBot() {
    try {
        logger.info('Initializing WhatsApp bot...');

        // Initialize database before loading commands
        await initializeDatabase();

        // Initialize language system  //Added language initialization
        const savedLanguage = config.getLanguage(); // Assumes config module exists
        lang.setDefaultLanguage(savedLanguage);
        logger.info(`Initialized with language: ${savedLanguage}`);


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

startBot();