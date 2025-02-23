const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.cooldowns = new Map();
        this.loadCommands();
    }

    loadCommands() {
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands'))
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            this.commands.set(command.name, command);
            logger.info(`Loaded command: ${command.name}`);
        }
    }

    getCommands() {
        return Array.from(this.commands.values());
    }

    async handleMessage(sock, msg) {
        if (!msg.message) return;

        const messageContent = Object.keys(msg.message)[0];
        if (messageContent === 'conversation' || messageContent === 'extendedTextMessage') {
            const messageText = msg.message.conversation || msg.message.extendedTextMessage.text;
            
            if (!messageText.startsWith(config.prefix)) return;

            const args = messageText.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!this.commands.has(commandName)) return;

            // Cooldown check
            if (this.cooldowns.has(`${msg.key.remoteJid}_${commandName}`)) {
                const cooldownExpiry = this.cooldowns.get(`${msg.key.remoteJid}_${commandName}`);
                if (Date.now() < cooldownExpiry) {
                    await sock.sendMessage(msg.key.remoteJid, { 
                        text: 'Please wait before using this command again.' 
                    });
                    return;
                }
            }

            try {
                const command = this.commands.get(commandName);
                await command.execute(sock, msg, args);
                
                // Set cooldown
                this.cooldowns.set(
                    `${msg.key.remoteJid}_${commandName}`,
                    Date.now() + config.commandCooldown
                );
            } catch (error) {
                logger.error(`Error executing command ${commandName}:`, error);
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: 'There was an error executing that command.' 
                });
            }
        }
    }
}

module.exports = new CommandHandler();
