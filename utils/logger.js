const pino = require('pino');

const logger = pino({ 
    level: 'debug', // Changed from 'info' to 'debug' for more detailed logs
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
        }
    }
});

// Extend the pino logger with our custom logging methods
const customLogger = {
    ...logger,
    info: (message, ...args) => {
        logger.info(`[INFO] ${message}`, ...args);
    },
    error: (message, ...args) => {
        logger.error(`[ERROR] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        logger.warn(`[WARN] ${message}`, ...args);
    },
    debug: (message, ...args) => {
        logger.debug(`[DEBUG] ${message}`, ...args);
    }
};

module.exports = customLogger;