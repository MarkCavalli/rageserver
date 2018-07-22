"use strict"

const misc = require('../cMisc');
const player = mp.players.local;


mp.events.add({
	"cCheapCarDealership-OpenBuyerMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RP/Browsers/Business/CheapCarDealership/ccd.html", lang);
		misc.injectCef(inject);
	},
});