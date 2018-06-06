"use strict"

const misc = require('/RP/cMisc');
const player = mp.players.local;



function showCef(lang, inject) {
	misc.prepareToCef(500);
	misc.openCef("package://RP/Browsers/Business/CheapCarDealership/ccd.html", lang);
	misc.injectCef(inject);
}


mp.events.add(
{
	"cCheapCarDealershipMenu" : (lang, inject) => {
		showCef(lang, inject);
	},

	"cCheapCarDealershipBuyCar" : (model, id) => {
		mp.events.callRemote("sCheapCarDealershipBuyCar", model, id);
	},

		
});

