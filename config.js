const JSONdb = require('simple-json-db');
const logger = require('./utils/logger');
const db = new JSONdb('./database.json');

const config = {
    // Bot configuration
    prefix: '!',
    ownerNumber: process.env.OWNER_NUMBER || '1234567890@s.whatsapp.net',
    language: 'de', // Default language
    availableLanguages: ['en', 'de'],

    // Command settings
    commandCooldown: 3000, // 3 seconds
    maxRetries: 3,

    // Session settings
    sessionExpiry: parseInt(process.env.SESSION_EXPIRY || '168', 10), // Hours
    sessionDebug: process.env.ENABLE_SESSION_DEBUG === 'true',

    // Database operations with error handling
    saveData: (key, value) => {
        try {
            db.set(key, value);
            return true;
        } catch (error) {
            logger.error('Database save error:', error);
            return false;
        }
    },

    getData: (key, defaultValue = null) => {
        try {
            const value = db.get(key);
            return value !== undefined ? value : defaultValue;
        } catch (error) {
            logger.error('Database read error:', error);
            return defaultValue;
        }
    },

    // Language settings
    setLanguage: (lang) => {
        if (config.availableLanguages.includes(lang)) {
            config.language = lang;
            config.saveData('language', lang);
            logger.info(`Language set to: ${lang}`);
            return true;
        }
        logger.warn(`Invalid language: ${lang}`);
        return false;
    },

    getLanguage: () => {
        const savedLang = config.getData('language');
        return savedLang || config.language;
    },

    // Helper functions
    isOwner: (number) => {
        return number === config.ownerNumber;
    },

    // Session management
    getSessionConfig: () => {
        return {
            sessionId: process.env.SESSION_ID || `session_${Date.now()}`,
            debug: config.sessionDebug,
            expiryHours: config.sessionExpiry
        };
    },

    // Command cooldown check
    checkCooldown: (userId, command) => {
        const key = `cooldown:${userId}:${command}`;
        const lastUsage = config.getData(key, 0);
        const now = Date.now();

        if (now - lastUsage < config.commandCooldown) {
            return false;
        }

        config.saveData(key, now);
        return true;
    }
};

module.exports = config;