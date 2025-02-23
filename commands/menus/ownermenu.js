const config = require('../../config');

module.exports = {
    name: 'ownermenu',
    description: 'Owner-only commands menu',
    async execute(sock, msg, args) {
        const menuText = `*🎭 𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Owner Commands 🎭*\n\n` +
            `⚡ *Broadcast Commands*\n` +
            `${config.prefix}bc - Broadcast message to all chats\n` +
            `${config.prefix}bcgroup - Broadcast to all groups\n` +
            `${config.prefix}bcprivate - Broadcast to private chats\n` +
            `${config.prefix}bcloc - Broadcast with location\n` +
            `${config.prefix}bcimage - Broadcast with image\n\n` +

            `🛠️ *Bot Management*\n` +
            `${config.prefix}restart - Restart the bot\n` +
            `${config.prefix}shutdown - Shutdown the bot\n` +
            `${config.prefix}maintenance - Toggle maintenance mode\n` +
            `${config.prefix}update - Update bot from source\n` +
            `${config.prefix}backup - Backup bot data\n\n` +

            `👥 *User Management*\n` +
            `${config.prefix}ban <@user> <reason> - Ban user from using bot\n` +
            `${config.prefix}unban <@user> - Unban a banned user\n` +
            `${config.prefix}banlist - Show list of banned users\n` +
            `${config.prefix}premium - Add premium user\n` +
            `${config.prefix}delpremium - Remove premium user\n\n` +

            `⚙️ *System Controls*\n` +
            `${config.prefix}setprefix - Change command prefix\n` +
            `${config.prefix}setbotbio - Set bot's about info\n` +
            `${config.prefix}setbotname - Set bot's display name\n` +
            `${config.prefix}setbotpp - Set bot's profile picture\n` +
            `${config.prefix}setwelcome - Set welcome message\n\n` +

            `📊 *Statistics & Monitoring*\n` +
            `${config.prefix}stats - Show bot statistics\n` +
            `${config.prefix}ping - Check bot latency\n` +
            `${config.prefix}runtime - Show bot uptime\n` +
            `${config.prefix}listgc - List all groups\n` +
            `${config.prefix}listpc - List private chats\n\n` +

            `🔒 *Security Features*\n` +
            `${config.prefix}encrypt - Encrypt bot files\n` +
            `${config.prefix}decrypt - Decrypt bot files\n` +
            `${config.prefix}antispam - Configure spam protection\n` +
            `${config.prefix}ratelimit - Set command rate limits\n` +
            `${config.prefix}blacklist - Manage blacklisted words\n\n` +

            `🔧 *Advanced Configuration*\n` +
            `${config.prefix}eval - Evaluate JavaScript code\n` +
            `${config.prefix}exec - Execute system command\n` +
            `${config.prefix}setup - Run setup wizard\n` +
            `${config.prefix}config - Edit bot configuration\n` +
            `${config.prefix}reset - Reset bot settings\n\n` +

            `⚠️ Note: These commands are restricted to bot owner only.\n` +
            `Owner: ${config.ownerNumber}`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻",
                    body: "Owner Commands Menu",
                    showAdAttribution: true
                }
            }
        });
    }
};