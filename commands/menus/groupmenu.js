const config = require('../../config');

module.exports = {
    name: 'groupmenu',
    description: 'Group management commands menu',
    async execute(sock, msg, args) {
        const menuText = `*👥 𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Group Commands 👥*\n\n` +
            `📊 *Group Information*\n` +
            `${config.prefix}groupinfo - Display group information\n` +
            `${config.prefix}memberlist - List all group members\n` +
            `${config.prefix}admins - List group admins\n` +
            `${config.prefix}grouplink - Get group invite link\n` +
            `${config.prefix}groupstats - Group activity statistics\n\n` +

            `⚙️ *Group Settings*\n` +
            `${config.prefix}group open/close - Open/close group\n` +
            `${config.prefix}welcome on/off - Toggle welcome message\n` +
            `${config.prefix}antilink on/off - Toggle anti-link\n` +
            `${config.prefix}autosticker on/off - Auto sticker mode\n` +
            `${config.prefix}nsfw on/off - Toggle NSFW content\n\n` +

            `👮 *Moderation Commands*\n` +
            `${config.prefix}kick - Remove member from group\n` +
            `${config.prefix}add - Add member to group\n` +
            `${config.prefix}promote - Make member admin\n` +
            `${config.prefix}demote - Remove admin status\n` +
            `${config.prefix}warn - Warn a member\n\n` +

            `🛡️ *Anti-Spam & Protection*\n` +
            `${config.prefix}antispam on/off - Spam protection\n` +
            `${config.prefix}antiflood on/off - Flood protection\n` +
            `${config.prefix}antifake on/off - Fake number filter\n` +
            `${config.prefix}antibot on/off - Block other bots\n` +
            `${config.prefix}antidelete on/off - Delete message log\n\n` +

            `📢 *Announcements*\n` +
            `${config.prefix}announce - Send announcement\n` +
            `${config.prefix}tagall - Mention all members\n` +
            `${config.prefix}hidetag - Hidden tag all\n` +
            `${config.prefix}poll - Create group poll\n` +
            `${config.prefix}emergency - Alert all admins\n\n` +

            `🎮 *Group Activities*\n` +
            `${config.prefix}game - Start group game\n` +
            `${config.prefix}quiz - Start quiz session\n` +
            `${config.prefix}tournament - Start tournament\n` +
            `${config.prefix}event - Create group event\n` +
            `${config.prefix}challenge - Group challenge\n\n` +

            `📝 *Group Management*\n` +
            `${config.prefix}setname - Change group name\n` +
            `${config.prefix}setdesc - Set group description\n` +
            `${config.prefix}setppgc - Set group icon\n` +
            `${config.prefix}revoke - Reset group link\n` +
            `${config.prefix}rules - Set/view group rules\n\n` +

            `⚠️ Note: Some commands require admin privileges.`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻",
                    body: "Group Commands Menu",
                    showAdAttribution: true
                }
            }
        });
    }
};