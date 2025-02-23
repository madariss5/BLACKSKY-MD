const config = require('../config');

module.exports = {
    name: 'menu',
    description: 'Display bot menu categories',
    async execute(sock, msg, args) {
        const menuText = `🤖 *𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Bot Menu* 🤖\n\n` +
            `Welcome to the most powerful WhatsApp Bot!\n\n` +
            `📜 *Available Menu Categories:*\n\n` +
            `👑 ${config.prefix}ownermenu - Owner Commands\n` +
            `👥 ${config.prefix}groupmenu - Group Commands\n` +
            `⚡ ${config.prefix}adminmenu - Admin Commands\n` +
            `🎮 ${config.prefix}funmenu - Fun Commands\n` +
            `🌟 ${config.prefix}generalmenu - General Commands\n\n` +
            `Use ${config.prefix}<menuname> to view specific commands.\n` +
            `Example: ${config.prefix}ownermenu\n\n` +
            `🔰 *Bot Info*\n` +
            `• Prefix: ${config.prefix}\n` +
            `• Creator: BlackSky Team\n` +
            `• Version: 2.0.0\n\n` +
            `⚠️ Note: Some commands are restricted to specific roles.`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻",
                    body: "Powerful WhatsApp Bot",
                    showAdAttribution: true
                }
            }
        });
    }
};
