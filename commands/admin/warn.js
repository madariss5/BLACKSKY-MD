const config = require('../../config');
const { JSONdb } = require('simple-json-db');
const fs = require('fs');

// Ensure database directory exists
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
}

const warnDB = new JSONdb('./database/warnings.json');

module.exports = {
    name: 'warn',
    description: 'Warn a group member',
    async execute(sock, msg, args) {
        // Check if message is from a group
        if (!msg.key.remoteJid.endsWith('@g.us')) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ This command can only be used in groups.' });
            return;
        }

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
        const participants = groupMetadata.participants;

        // Check if sender is admin
        const isAdmin = participants.some(p => p.id === msg.key.participant && p.admin);
        if (!isAdmin) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Only admins can use this command.' });
            return;
        }

        if (args.length < 2) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ Please provide user and reason.\nUsage: ${config.prefix}warn @user reason` 
            });
            return;
        }

        // Extract user ID from mention
        const userId = args[0].replace('@', '').split('@')[0] + '@s.whatsapp.net';
        const reason = args.slice(1).join(' ');

        // Initialize warnings array for group if not exists
        const groupWarnings = warnDB.get(msg.key.remoteJid) || {};
        if (!groupWarnings[userId]) {
            groupWarnings[userId] = [];
        }

        // Add warning
        groupWarnings[userId].push({
            reason: reason,
            timestamp: Date.now(),
            warnedBy: msg.key.participant
        });

        // Save to database
        warnDB.set(msg.key.remoteJid, groupWarnings);

        const warningCount = groupWarnings[userId].length;
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `⚠️ *WARNING #${warningCount}*\n\n` +
                  `User: @${userId.split('@')[0]}\n` +
                  `Reason: ${reason}\n\n` +
                  `This user now has ${warningCount} warning(s).`,
            mentions: [userId]
        });
    }
};