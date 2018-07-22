"use strict"

const misc = require('../cMisc');
const player = mp.players.local;


mp.events.add({
	"cBusinnes-ShowMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RP/Browsers/Business/business.html", lang);
		misc.injectCef(inject);
	},	
});