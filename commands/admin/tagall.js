const config = require('../../config');

module.exports = {
    name: 'tagall',
    description: 'Tag all members with a custom message',
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

        if (args.length === 0) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ Please provide a message.\nUsage: ${config.prefix}tagall your message here` 
            });
            return;
        }

        const message = args.join(' ');
        let mentions = participants.map(p => p.id);
        let tagMessage = `📢 *Group Announcement* 📢\n\n${message}\n\n`;
        
        // Add mentions in a formatted way
        participants.forEach(p => {
            tagMessage += `@${p.id.split('@')[0]}\n`;
        });

        await sock.sendMessage(msg.key.remoteJid, { 
            text: tagMessage,
            mentions: mentions
        });
    }
};
