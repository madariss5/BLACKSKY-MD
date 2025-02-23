const config = require('../../config');

module.exports = {
    name: 'funmenu',
    description: 'Fun and entertainment commands menu',
    async execute(sock, msg, args) {
        const menuText = `*🎮 𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Fun Commands 🎮*\n\n` +
            `🎯 *Games*\n` +
            `${config.prefix}tictactoe - Play TicTacToe\n` +
            `${config.prefix}chess - Play chess\n` +
            `${config.prefix}hangman - Play hangman\n` +
            `${config.prefix}rps - Rock, paper, scissors\n` +
            `${config.prefix}slots - Slot machine\n\n` +

            `🎨 *Creative Tools*\n` +
            `${config.prefix}sticker - Create sticker\n` +
            `${config.prefix}meme - Random meme\n` +
            `${config.prefix}emoji - Emoji art\n` +
            `${config.prefix}pixel - Pixelate image\n` +
            `${config.prefix}cartoon - Cartoonify image\n\n` +

            `🎵 *Music & Audio*\n` +
            `${config.prefix}lyrics - Find song lyrics\n` +
            `${config.prefix}sing - AI singing\n` +
            `${config.prefix}voice - Voice effects\n` +
            `${config.prefix}rap - Generate rap\n` +
            `${config.prefix}remix - Remix audio\n\n` +

            `🎪 *Entertainment*\n` +
            `${config.prefix}joke - Random joke\n` +
            `${config.prefix}riddle - Random riddle\n` +
            `${config.prefix}fact - Random fact\n` +
            `${config.prefix}quote - Inspirational quote\n` +
            `${config.prefix}meme - Random meme\n\n` +

            `🎭 *Role-Play*\n` +
            `${config.prefix}truth - Truth question\n` +
            `${config.prefix}dare - Dare challenge\n` +
            `${config.prefix}ship - Ship two users\n` +
            `${config.prefix}marry - Marry someone\n` +
            `${config.prefix}divorce - Get divorced\n\n` +

            `🎲 *Mini Games*\n` +
            `${config.prefix}flip - Flip a coin\n` +
            `${config.prefix}roll - Roll dice\n` +
            `${config.prefix}quiz - Random quiz\n` +
            `${config.prefix}math - Math challenge\n` +
            `${config.prefix}wordle - Play Wordle\n\n` +

            `🎨 *Filters & Effects*\n` +
            `${config.prefix}blur - Blur image\n` +
            `${config.prefix}sketch - Sketch effect\n` +
            `${config.prefix}comic - Comic effect\n` +
            `${config.prefix}paint - Painting effect\n` +
            `${config.prefix}neon - Neon effect\n\n` +

            `⚡ Have fun with these commands!`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻",
                    body: "Fun Commands Menu",
                    showAdAttribution: true
                }
            }
        });
    }
};