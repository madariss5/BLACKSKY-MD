const JSONdb = require('simple-json-db');
const db = new JSONdb('./database.json');

const config = {
    // Bot configuration
    prefix: '!',
    ownerNumber: '1234567890@s.whatsapp.net', // Change this to your number
    language: 'de', // Default language
    availableLanguages: ['en', 'de'], // Available languages

    // Command settings
    commandCooldown: 3000, // 3 seconds

    // Database operations
    saveData: (key, value) => {
        try {
            db.set(key, value);
            return true;
        } catch (error) {
            console.error('Database save error:', error);
            return false;
        }
    },

    getData: (key) => {
        try {
            return db.get(key);
        } catch (error) {
            console.error('Database read error:', error);
            return null;
        }
    },

    // Language settings
    setLanguage: (lang) => {
        if (config.availableLanguages.includes(lang)) {
            config.language = lang;
            config.saveData('language', lang);
            return true;
        }
        return false;
    },

    getLanguage: () => {
        const savedLang = config.getData('language');
        return savedLang || config.language;
    }
};

module.exports = config;