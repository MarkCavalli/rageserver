"use strict"

const misc = require('/RP/cMisc');
const player = mp.players.local;



function showCef(inject) {
	misc.prepareToCef(500);
	misc.openCef("package://RP/Browsers/Business/business.html");
	misc.injectCef(inject);
}


mp.events.add(
{
	"cBusinnesShowMenu" : (inject) => {
		showCef(inject);
	},
	
	"cBuyBusiness" : () => {
		mp.events.callRemote('sBuyBusiness');
	},
	
	"cSellBusiness" : () => {
		mp.events.callRemote('sSellBusiness');
	},
	
	"cBusinessTakeBalanceMoney" : () => {
		mp.events.callRemote('sBusinessTakeBalanceMoney');
	},
	
	"cBusinessChangeMargin" : (margin) => {
		mp.events.callRemote('sBusinessChangeMargin', margin);
    },
	
});