const config = require('../config');

module.exports = {
    name: 'help',
    description: 'Display available commands',
    async execute(sock, msg, args) {
        const commandHandler = require('../handlers/commandHandler');
        const commands = commandHandler.getCommands();
        
        let helpText = '🤖 *Available Commands*\n\n';
        commands.forEach(cmd => {
            helpText += `${config.prefix}${cmd.name}: ${cmd.description}\n`;
        });
        
        await sock.sendMessage(msg.key.remoteJid, { text: helpText });
    }
};
