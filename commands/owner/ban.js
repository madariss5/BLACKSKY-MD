const config = require('../../config');
const { JSONdb } = require('simple-json-db');
const fs = require('fs');

// Ensure database directory exists
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
}

const banDB = new JSONdb('./database/bans.json');

module.exports = {
    name: 'ban',
    description: 'Ban a user from using the bot',
    async execute(sock, msg, args) {
        // Check if sender is owner
        if (msg.key.remoteJid !== config.ownerNumber) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Only the bot owner can use this command.' });
            return;
        }

        if (args.length < 2) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ Please provide user and reason.\nUsage: ${config.prefix}ban @user reason` 
            });
            return;
        }

        // Extract user ID from mention
        const userId = args[0].replace('@', '').split('@')[0] + '@s.whatsapp.net';
        const reason = args.slice(1).join(' ');

        // Save to database
        banDB.set(userId, {
            reason: reason,
            timestamp: Date.now(),
            bannedBy: msg.key.remoteJid
        });

        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✅ User ${userId} has been banned.\nReason: ${reason}` 
        });
    }
};