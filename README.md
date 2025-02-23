# WhatsApp Bot

A robust WhatsApp Bot with advanced messaging and session management capabilities.

## Features

- 🚀 Multi-language support (English, German)
- 🔐 Secure session management with Mega cloud storage
- 📊 Command handling system with cooldown
- 🛡️ Advanced error handling and reconnection
- 💬 Group management capabilities
- 🎮 Fun commands and utilities

## Prerequisites

- Node.js v20 or higher
- A Mega.nz account for session storage
- WhatsApp account for bot hosting

## Environment Variables

Create a `.env` file with:

```env
MEGA_EMAIL=your_mega_email
MEGA_PASSWORD=your_mega_password
SESSION_ID=your_session_id
ENABLE_SESSION_DEBUG=false
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-bot.git
cd whatsapp-bot
```

2. Install dependencies:
```bash
npm install
```

3. Start the bot:
```bash
npm start
```

## Deployment

### On Replit

1. Create a new Repl
2. Import from GitHub
3. Set environment variables in Replit Secrets
4. Click Run

### Manual Deployment

1. Ensure Node.js v20+ is installed
2. Set up environment variables
3. Run `npm install`
4. Start with `npm start`

## Commands

- `!help` - Show all available commands
- `!ping` - Check bot response time
- `!menu` - Display command menu
- More commands in `commands/` directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, join our [Discord/Telegram] community or open an issue.

## Acknowledgments

- [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) for the WhatsApp Web API
- [megajs](https://github.com/qgustavor/mega) for cloud storage integration
