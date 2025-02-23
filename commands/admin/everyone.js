const config = require('../../config');

module.exports = {
    name: 'everyone',
    description: 'Tag all group members',
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

        let mentions = participants.map(p => p.id);
        let message = '👥 *Attention Everyone!* 👥\n\n';
        
        if (args.length > 0) {
            message += args.join(' ');
        }

        await sock.sendMessage(msg.key.remoteJid, { 
            text: message,
            mentions: mentions
        });
    }
};
