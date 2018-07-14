//I18n settings
//See https://www.npmjs.com/package/i18n-nodejs

const misc = require('./sMisc');

const lang = misc.getPlayerLang(player);

exports.i18n_lang = lang ;  //You should check language support for file below.
exports.i18n_langFile = "./../../serverside_locale.json";  //One file translation.
