define(function(require, exports, module) {
    var langList = {
        'en': require('../l10n/en'),
        'de': require('../l10n/de'),
        'zh_CN': require('../l10n/zh_CN')
    };
    var defaultLang = 'en';
    function lang(text, block, lang) {
        if (lang === undefined) {
            lang = defaultLang;
        }
        var dict = langList[lang];
        if (dict === undefined) {
            dict = langList['en'];
        }
        block.split('/').forEach(function(ele, idx) {
            dict = dict[ele];
        });

        if (dict === null) {
            return text;
        }

        return dict[text] || text;

    }

    return module.exports = {
        setDefaultLang : function(lang) {
            if (langList[lang] !== undefined) {
                defaultLang = lang;
                return true;
            }
            return false;
        },
        t: lang
    };
});