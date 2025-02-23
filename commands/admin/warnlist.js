const config = require('../../config');
const { JSONdb } = require('simple-json-db');
const logger = require('../../utils/logger');

// Initialize the warning database
let warnDB;
try {
    warnDB = new JSONdb('./database/warnings.json');
} catch (error) {
    logger.error('Error accessing warning database:', error.stack);
}

module.exports = {
    name: 'warnlist',
    description: 'Show list of warnings in the group',
    async execute(sock, msg, args) {
        try {
            // Check if database is available
            if (!warnDB) {
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: '❌ The warning system is currently unavailable.' 
                });
                return;
            }

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

            // Get group warnings
            const groupWarnings = warnDB.get(msg.key.remoteJid) || {};

            if (Object.keys(groupWarnings).length === 0) {
                await sock.sendMessage(msg.key.remoteJid, { text: '📝 No warnings in this group.' });
                return;
            }

            let warnList = '📋 *Group Warnings List*\n\n';
            const mentions = [];

            for (const [userId, warnings] of Object.entries(groupWarnings)) {
                mentions.push(userId);
                warnList += `👤 @${userId.split('@')[0]}\n`;
                warnList += `📝 Total Warnings: ${warnings.length}\n\n`;

                warnings.forEach((warn, index) => {
                    warnList += `Warning #${index + 1}:\n` +
                            `📝 Reason: ${warn.reason}\n` +
                            `⏰ Time: ${new Date(warn.timestamp).toLocaleString()}\n` +
                            `👮 Warned by: @${warn.warnedBy.split('@')[0]}\n\n`;
                    mentions.push(warn.warnedBy);
                });
                warnList += `─────────────────\n\n`;
            }

            await sock.sendMessage(msg.key.remoteJid, { 
                text: warnList,
                mentions: mentions
            });
        } catch (error) {
            logger.error('Error executing warnlist command:', error.stack);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '❌ An error occurred while executing the warnlist command.' 
            });
        }
    }
};