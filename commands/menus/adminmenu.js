const config = require('../../config');

module.exports = {
    name: 'adminmenu',
    description: 'Admin commands menu',
    async execute(sock, msg, args) {
        const menuText = `*👑 𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Admin Commands 👑*\n\n` +
            `🛡️ *Group Protection*\n` +
            `${config.prefix}antispam on/off - Toggle anti-spam\n` +
            `${config.prefix}antiflood on/off - Toggle anti-flood\n` +
            `${config.prefix}antitoxic on/off - Toggle anti-toxic\n` +
            `${config.prefix}antiraid on/off - Raid protection\n` +
            `${config.prefix}antibadword - Word filter\n\n` +

            `📢 *Announcements*\n` +
            `${config.prefix}announce - Send announcement\n` +
            `${config.prefix}everyone - Tag all members\n` +
            `${config.prefix}tagall - Tag all with custom message\n` +
            `${config.prefix}hidetag - Hidden tag all\n` +
            `${config.prefix}emergency - Alert all admins\n` +
            `${config.prefix}broadcast - Group broadcast\n\n` +

            `⚙️ *Group Settings*\n` +
            `${config.prefix}setname - Set group name\n` +
            `${config.prefix}setdesc - Set description\n` +
            `${config.prefix}setppgc - Set group icon\n` +
            `${config.prefix}setlang - Set group language\n` +
            `${config.prefix}setwelcome - Welcome message\n\n` +

            `👥 *Member Management*\n` +
            `${config.prefix}warn <@user> <reason> - Warn member\n` +
            `${config.prefix}unwarn <@user> - Remove warning\n` +
            `${config.prefix}warnlist - View all warnings\n` +
            `${config.prefix}kick - Remove member\n` +
            `${config.prefix}add - Add member\n\n` +

            `🔒 *Permission Control*\n` +
            `${config.prefix}promote - Make admin\n` +
            `${config.prefix}demote - Remove admin\n` +
            `${config.prefix}mute - Mute member\n` +
            `${config.prefix}unmute - Unmute member\n` +
            `${config.prefix}ban - Ban member\n\n` +

            `📊 *Group Analytics*\n` +
            `${config.prefix}activity - Member activity\n` +
            `${config.prefix}chatdata - Chat statistics\n` +
            `${config.prefix}members - Member info\n` +
            `${config.prefix}groupinfo - Group details\n` +
            `${config.prefix}report - Activity report\n\n` +

            `🎯 *Event Management*\n` +
            `${config.prefix}event - Create event\n` +
            `${config.prefix}schedule - Schedule message\n` +
            `${config.prefix}reminder - Set reminder\n` +
            `${config.prefix}poll - Create poll\n` +
            `${config.prefix}vote - Manage votes\n\n` +

            `⚠️ Note: These commands are for group admins only.`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻",
                    body: "Admin Commands Menu",
                    showAdAttribution: true
                }
            }
        });
    }
};