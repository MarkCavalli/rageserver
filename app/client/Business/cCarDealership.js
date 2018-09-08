const misc = require('../cMisc');

mp.events.add({
	"cCheapCarDealership-OpenBuyerMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RP/Browsers/Business/CheapCarDealership/ccd.html", lang);
		misc.injectCef(inject);
	},

	"cCommercialCarDealership-OpenBuyerMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RP/Browsers/Business/CommercialCarDealership/ccd.html", lang);
		misc.injectCef(inject);
	}
});