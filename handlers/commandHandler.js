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
            try {
                const command = require(`../commands/${file}`);
                this.commands.set(command.name, command);
                logger.info(`Loaded command: ${command.name}`);
            } catch (error) {
                logger.error(`Failed to load command from ${file}:`, error);
            }
        }
    }

    getCommands() {
        return Array.from(this.commands.values());
    }

    async handleMessage(sock, msg) {
        if (!msg.message) {
            logger.debug('Skipping message with no content');
            return;
        }

        const messageContent = Object.keys(msg.message)[0];
        if (messageContent === 'conversation' || messageContent === 'extendedTextMessage') {
            const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
            logger.debug('Processing message:', { text: messageText, type: messageContent });

            if (!messageText.startsWith(config.prefix)) {
                logger.debug('Message does not start with prefix, ignoring');
                return;
            }

            const args = messageText.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!this.commands.has(commandName)) {
                logger.debug(`Command not found: ${commandName}`);
                return;
            }

            // Cooldown check
            const cooldownKey = `${msg.key.remoteJid}_${commandName}`;
            if (this.cooldowns.has(cooldownKey)) {
                const cooldownExpiry = this.cooldowns.get(cooldownKey);
                if (Date.now() < cooldownExpiry) {
                    const remainingTime = Math.ceil((cooldownExpiry - Date.now()) / 1000);
                    await sock.sendMessage(msg.key.remoteJid, { 
                        text: `Please wait ${remainingTime} seconds before using this command again.` 
                    });
                    return;
                }
            }

            try {
                logger.debug(`Executing command: ${commandName}`);
                const command = this.commands.get(commandName);
                await command.execute(sock, msg, args);

                // Set cooldown
                this.cooldowns.set(
                    cooldownKey,
                    Date.now() + config.commandCooldown
                );
                logger.debug(`Command ${commandName} executed successfully`);
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