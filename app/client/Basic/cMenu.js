const misc = require('../cMisc');

mp.events.add({
	"cMenu-Open" : (lang, inject) => {
		misc.prepareToCef(1);
		misc.openCef("package://RP/Browsers/Menu/Menu.html", lang);
		misc.injectCef(inject);
	},
	
});