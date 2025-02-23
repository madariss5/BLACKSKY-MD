// German translations
module.exports = {
    // General messages
    welcome: {
        greeting: "👋 *Willkommen beim WhatsApp Bot!*\n\n" +
                 "Hier sind einige Dinge, die Sie tun können:\n" +
                 "!help - Zeige alle verfügbaren Befehle\n" +
                 "!ping - Überprüfen Sie, ob der Bot reagiert\n\n" +
                 "Probieren Sie diese Befehle aus, um loszulegen!",
        connection: "🤖 *WhatsApp Bot Verbunden!*\n\n" +
                   "• Gerät: {device}\n" +
                   "• Sitzungs-ID: {sessionId}\n" +
                   "• Zeit: {time}\n" +
                   "• Status: Aktiv\n\n" +
                   "Geben Sie !help ein, um verfügbare Befehle zu sehen",
        sessionWarning: "⚠️Teilen Sie diese Datei mit niemandem⚠️\n\n" +
                       "┌─❖\n" +
                       "│ Ohayo 😽\n" +
                       "└┬❖\n" +
                       "┌┤✑  Danke, dass Sie den WhatsApp Bot nutzen\n" +
                       "│└────────────┈ ⳹\n" +
                       "│©2023-2025 WhatsApp Bot\n" +
                       "└─────────────────┈ ⳹\n\n"
    },

    // Error messages
    errors: {
        groupOnly: "❌ Dieser Befehl kann nur in Gruppen verwendet werden.",
        adminOnly: "❌ Nur Administratoren können diesen Befehl verwenden.",
        ownerOnly: "❌ Nur der Bot-Besitzer kann diesen Befehl verwenden.",
        unavailable: "❌ Das System ist derzeit nicht verfügbar.",
        generalError: "❌ Bei der Ausführung des Befehls ist ein Fehler aufgetreten.",
        invalidArgs: "❌ Ungültige Argumente. Verwendung: {usage}",
        noPermission: "❌ Sie haben keine Berechtigung für diesen Befehl.",
        cooldown: "⏳ Bitte warten Sie {time} Sekunden, bevor Sie diesen Befehl erneut verwenden.",
        databaseError: "❌ Datenbankfehler aufgetreten. Bitte versuchen Sie es später erneut.",
        invalidInput: "❌ Ungültige Eingabe. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
        userNotFound: "❌ Benutzer nicht gefunden.",
        groupNotFound: "❌ Gruppe nicht gefunden.",
        commandDisabled: "❌ Dieser Befehl ist derzeit deaktiviert.",
        missingArgs: "❌ Fehlende Argumente. Verwendung: {usage}"
    },

    // Success messages
    success: {
        banned: "✅ Benutzer {user} wurde gesperrt.\nGrund: {reason}",
        unbanned: "✅ Benutzer {user} wurde entsperrt.",
        warned: "⚠️ *WARNUNG #{count}*\n\nBenutzer: @{user}\nGrund: {reason}\n\nDieser Benutzer hat jetzt {count} Warnung(en).",
        unwarned: "✅ Letzte Warnung von @{user} entfernt.\nVerbleibende Warnungen: {count}",
        cleared: "✅ Alle Daten wurden gelöscht.",
        updated: "✅ Einstellungen wurden aktualisiert.",
        saved: "✅ Änderungen wurden gespeichert.",
        settingsUpdated: "✅ Gruppeneinstellungen wurden aktualisiert.",
        roleAssigned: "✅ Rolle wurde zugewiesen.",
        eventCreated: "✅ Ereignis wurde erstellt.",
        pollCreated: "✅ Umfrage wurde erstellt.",
        noteAdded: "✅ Notiz wurde hinzugefügt.",
        commandEnabled: "✅ Befehl wurde aktiviert.",
        memberPromoted: "✅ Mitglied wurde zum Admin befördert.",
        memberDemoted: "✅ Admin-Status wurde entzogen."
    },

    // Menu titles
    menus: {
        help: "🤖 *Verfügbare Befehle*",
        main: "🤖 *𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Bot-Menü*",
        owner: "🎭 *𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Besitzer-Befehle*",
        admin: "👑 *𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Admin-Befehle*",
        group: "👥 *𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Gruppen-Befehle*",
        fun: "🎮 *𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Spaß-Befehle*",
        general: "🌟 *𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Allgemeine Befehle*"
    },

    // Command categories
    categories: {
        basic: "📊 *Grundlegende Gruppenverwaltung*",
        settings: "⚙️ *Gruppeneinstellungen*",
        protection: "🛡️ *Gruppenschutz*",
        admin: "👮 *Admin-Aktionen*",
        announcements: "📢 *Ankündigungen*",
        activities: "🎮 *Gruppenaktivitäten*",
        analytics: "📊 *Gruppenanalysen*",
        roles: "🎭 *Rollenverwaltung*",
        config: "🔧 *Gruppenkonfiguration*",
        notes: "📝 *Gruppennotizen*",
        events: "📅 *Ereignisverwaltung*",
        auto: "🔄 *Automatische Antworten*",
        polls: "📊 *Umfragen & Abstimmungen*",
        goals: "🎯 *Gruppenziele*",
        pins: "📌 *Angeheftete Nachrichten*",
        invites: "🔗 *Einladungsverwaltung*",
        security: "🔒 *Sicherheitseinstellungen*",
        members: "📋 *Mitgliederlisten*",
        custom: "🎨 *Gruppenanpassung*",
        economy: "📈 *Gruppenökonomie*",
        events: "🎪 *Gruppenereignisse*",
        bot: "🤖 *Bot-Interaktion*"
    },

    // Command descriptions
    commands: {
        // Basic commands
        help: "Zeige verfügbare Befehle",
        ping: "Überprüfe die Bot-Reaktionszeit",
        start: "Starte den Bot",
        menu: "Zeige das Hauptmenü",

        // Group management
        groupinfo: "Zeige Gruppeninformationen",
        memberlist: "Liste alle Gruppenmitglieder auf",
        admins: "Liste Gruppenadministratoren auf",
        grouplink: "Hole Gruppeneinladungslink",
        groupstats: "Zeige Gruppenaktivitätsstatistiken",
        setname: "Ändere den Gruppennamen",
        setdesc: "Setze die Gruppenbeschreibung",
        setppgc: "Setze das Gruppensymbol",
        revoke: "Setze den Gruppenlink zurück",
        rules: "Zeige/setze Gruppenregeln",

        // Admin commands
        kick: "Entferne Mitglied aus der Gruppe",
        add: "Füge Mitglied zur Gruppe hinzu",
        promote: "Befördere zum Admin",
        demote: "Entziehe Admin-Status",
        warn: "Verwarne ein Mitglied",
        unwarn: "Entferne Verwarnung",
        ban: "Sperre Benutzer",
        unban: "Entsperre Benutzer",
        mute: "Stumm schalte Mitglied",
        unmute: "Aufhebe Stummschaltung",

        // Announcement commands
        announce: "Sende eine Ankündigung",
        tagall: "Markiere alle Mitglieder",
        hidetag: "Versteckte Markierung aller",
        poll: "Erstelle eine Umfrage",
        emergency: "Alarmiere alle Admins",

        // And many more command translations...
    }
};