const config = require('../../config');

module.exports = {
    name: 'generalmenu',
    description: 'General purpose commands menu',
    async execute(sock, msg, args) {
        const menuText = `*🌟 𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 General Commands 🌟*\n\n` +
            `ℹ️ *Bot Information*\n` +
            `${config.prefix}ping - Check bot response\n` +
            `${config.prefix}stats - Bot statistics\n` +
            `${config.prefix}runtime - Bot uptime\n` +
            `${config.prefix}speed - Connection speed\n` +
            `${config.prefix}owner - Bot owner info\n\n` +

            `🔍 *Search Tools*\n` +
            `${config.prefix}google - Google search\n` +
            `${config.prefix}image - Image search\n` +
            `${config.prefix}wiki - Wikipedia search\n` +
            `${config.prefix}weather - Check weather\n` +
            `${config.prefix}translate - Translate text\n\n` +

            `⚙️ *Utilities*\n` +
            `${config.prefix}calc - Calculator\n` +
            `${config.prefix}tts - Text to speech\n` +
            `${config.prefix}currency - Currency converter\n` +
            `${config.prefix}reminder - Set reminder\n` +
            `${config.prefix}schedule - Schedule message\n\n` +

            `📱 *Media Tools*\n` +
            `${config.prefix}ytdl - YouTube downloader\n` +
            `${config.prefix}tiktok - TikTok downloader\n` +
            `${config.prefix}insta - Instagram downloader\n` +
            `${config.prefix}twitter - Twitter downloader\n` +
            `${config.prefix}fb - Facebook downloader\n\n` +

            `🔧 *Converters*\n` +
            `${config.prefix}sticker - Create sticker\n` +
            `${config.prefix}toimg - Sticker to image\n` +
            `${config.prefix}tomp3 - Video to audio\n` +
            `${config.prefix}tovn - Audio to voice note\n` +
            `${config.prefix}tourl - Media to URL\n\n` +

            `📊 *Information*\n` +
            `${config.prefix}covid - Covid statistics\n` +
            `${config.prefix}news - Latest news\n` +
            `${config.prefix}crypto - Crypto prices\n` +
            `${config.prefix}stock - Stock market info\n` +
            `${config.prefix}movie - Movie information\n\n` +

            `🌐 *Internet Tools*\n` +
            `${config.prefix}ping - Check ping\n` +
            `${config.prefix}ip - IP information\n` +
            `${config.prefix}whois - Domain info\n` +
            `${config.prefix}short - URL shortener\n` +
            `${config.prefix}qr - Generate QR code\n\n` +

            `💫 These commands are available to everyone!`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻",
                    body: "General Commands Menu",
                    showAdAttribution: true
                }
            }
        });
    }
};