const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class LanguageHandler {
    constructor() {
        this.languages = {};
        this.defaultLang = 'en';
        this.loadLanguages();
    }

    loadLanguages() {
        try {
            const localesDir = path.join(__dirname, '..', 'locales');
            const files = fs.readdirSync(localesDir);
            
            files.forEach(file => {
                if (file.endsWith('.js')) {
                    const langCode = file.replace('.js', '');
                    this.languages[langCode] = require(path.join(localesDir, file));
                    logger.info(`Loaded language: ${langCode}`);
                }
            });
        } catch (error) {
            logger.error('Error loading languages:', error);
        }
    }

    getText(key, lang = this.defaultLang, params = {}) {
        try {
            const langData = this.languages[lang] || this.languages[this.defaultLang];
            const keys = key.split('.');
            let text = keys.reduce((obj, k) => obj?.[k], langData);

            if (!text) {
                logger.warn(`Translation not found for key: ${key} in language: ${lang}`);
                return key;
            }

            // Replace parameters in the text
            return this.replaceParams(text, params);
        } catch (error) {
            logger.error(`Error getting text for key: ${key}`, error);
            return key;
        }
    }

    replaceParams(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    setDefaultLanguage(lang) {
        if (this.languages[lang]) {
            this.defaultLang = lang;
            logger.info(`Default language set to: ${lang}`);
            return true;
        }
        return false;
    }

    getAvailableLanguages() {
        return Object.keys(this.languages);
    }
}

// Export a singleton instance
module.exports = new LanguageHandler();
