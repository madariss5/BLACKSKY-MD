const { proto } = require('@whiskeysockets/baileys');
const KeyedDB = require('@adiwajshing/keyed-db');

class MessageStore {
    constructor() {
        this.messages = new KeyedDB(this.messageUniqueKey, this.messageCompare);
    }

    messageUniqueKey(msg) {
        const participant = msg.key.participant || '';
        return `${msg.key.remoteJid}-${msg.key.id}-${participant}`;
    }

    messageCompare(msg1, msg2) {
        return msg2.messageTimestamp - msg1.messageTimestamp;
    }

    loadMessage(jid, id) {
        const message = this.messages.get(`${jid}-${id}-`);
        return message?.message || null;
    }

    loadMessages(jid, count = 10) {
        return this.messages
            .filter(m => m.key.remoteJid === jid)
            .slice(0, count);
    }

    insertMessage(msg) {
        this.messages.insert(msg);
    }

    deleteMessage(jid, id) {
        const message = this.loadMessage(jid, id);
        if (message) {
            this.messages.delete(message);
        }
    }
}

// Export a singleton instance
module.exports = new MessageStore();