const config = require('../../config');
const { JSONdb } = require('simple-json-db');
const fs = require('fs');

// Ensure database directory exists
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
}

const banDB = new JSONdb('./database/bans.json');

module.exports = {
    name: 'banlist',
    description: 'Show list of banned users',
    async execute(sock, msg, args) {
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
    }
};