const config = require('../config');

module.exports = {
    name: 'start',
    description: 'Get started with the bot',
    async execute(sock, msg, args) {
        const welcomeMessage = `👋 *Welcome to WhatsApp Bot!*\n\n` +
            `Here are some things you can do:\n` +
            `${config.prefix}help - Show all available commands\n` +
            `${config.prefix}ping - Check if the bot is responsive\n\n` +
            `Try these commands to get started!`;
            
        await sock.sendMessage(msg.key.remoteJid, { text: welcomeMessage });
    }
};
