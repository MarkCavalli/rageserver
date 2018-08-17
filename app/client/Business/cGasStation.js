"use strict";

const misc = require('../cMisc');

mp.events.add({
	"cGasStation-OpenBuyerMenu" : (lang, inject, camData) => {
		const d = JSON.parse(camData);
		misc.createCam(d.x, d.y, d.z, 0, 0, d.rz, d.viewangle);
		misc.prepareToCef();
		misc.openCef("package://RP/Browsers/Business/GasStation/gs.html", lang);
		misc.injectCef(inject);
	}
});
