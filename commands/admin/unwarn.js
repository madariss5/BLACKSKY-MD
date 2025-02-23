const config = require('../../config');
const { JSONdb } = require('simple-json-db');
const fs = require('fs');

// Ensure database directory exists
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
}

const warnDB = new JSONdb('./database/warnings.json');

module.exports = {
    name: 'unwarn',
    description: 'Remove a warning from a user',
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

        if (args.length < 1) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ Please mention the user.\nUsage: ${config.prefix}unwarn @user` 
            });
            return;
        }

        // Extract user ID from mention
        const userId = args[0].replace('@', '').split('@')[0] + '@s.whatsapp.net';

        // Get group warnings
        const groupWarnings = warnDB.get(msg.key.remoteJid) || {};

        if (!groupWarnings[userId] || groupWarnings[userId].length === 0) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '❌ This user has no warnings.',
                mentions: [userId]
            });
            return;
        }

        // Remove latest warning
        groupWarnings[userId].pop();

        // Update database
        if (groupWarnings[userId].length === 0) {
            delete groupWarnings[userId];
        }
        warnDB.set(msg.key.remoteJid, groupWarnings);

        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✅ Removed latest warning from @${userId.split('@')[0]}.\n` +
                  `Remaining warnings: ${groupWarnings[userId]?.length || 0}`,
            mentions: [userId]
        });
    }
};