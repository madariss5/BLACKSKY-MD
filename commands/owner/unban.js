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
    name: 'unban',
    description: 'Unban a user from the bot',
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

            if (args.length < 1) {
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `❌ Please mention the user to unban.\nUsage: ${config.prefix}unban @user` 
                });
                return;
            }

            // Extract user ID from mention
            const userId = args[0].replace('@', '').split('@')[0] + '@s.whatsapp.net';

            // Check if user is banned
            if (!banDB.has(userId)) {
                await sock.sendMessage(msg.key.remoteJid, { text: '❌ This user is not banned.' });
                return;
            }

            // Remove from database
            banDB.delete(userId);

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `✅ User ${userId} has been unbanned.` 
            });
        } catch (error) {
            logger.error('Error executing unban command:', error.stack);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '❌ An error occurred while executing the unban command.' 
            });
        }
    }
};