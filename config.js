const JSONdb = require('simple-json-db');
const db = new JSONdb('./database.json');

const config = {
    // Bot configuration
    prefix: '!',
    ownerNumber: '1234567890@s.whatsapp.net', // Change this to your number
    
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
    }
};

module.exports = config;
