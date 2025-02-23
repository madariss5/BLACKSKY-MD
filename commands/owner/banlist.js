const config = require('../../config');
const { JSONdb } = require('simple-json-db');
const logger = require('../../utils/logger');

// Initialize the ban database
let banDB;
try {
    banDB = new JSONdb('./database/bans.json');
} catch (error) {
    logger.error('Error accessing ban database:', error.stack);
}

module.exports = {
    name: 'banlist',
    description: 'Show list of banned users',
    async execute(sock, msg, args) {
        try {
            // Check if database is available
            if (!banDB) {
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: '❌ The ban system is currently unavailable.' 
                });
                return;
            }

            // Check if sender is owner
            if (msg.key.remoteJid !== config.ownerNumber) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ Only the bot owner can use this command.' });
                return;
            }

            const bans = banDB.JSON();

            if (Object.keys(bans).length === 0) {
                await sock.sendMessage(msg.key.remoteJid, { text: '📝 No users are currently banned.' });
                return;
            }

            let banList = '📋 *Banned Users List*\n\n';
            for (const [userId, banInfo] of Object.entries(bans)) {
                banList += `👤 User: ${userId}\n` +
                        `📝 Reason: ${banInfo.reason}\n` +
                        `⏰ Banned on: ${new Date(banInfo.timestamp).toLocaleString()}\n` +
                        `👑 Banned by: ${banInfo.bannedBy}\n\n`;
            }

            await sock.sendMessage(msg.key.remoteJid, { text: banList });
        } catch (error) {
            logger.error('Error executing banlist command:', error.stack);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '❌ An error occurred while executing the banlist command.' 
            });
        }
    }
};