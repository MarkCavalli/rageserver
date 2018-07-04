"use strict"

const misc = require('../cMisc');
const player = mp.players.local;



function showCef(lang, inject, camData) {
	const d = JSON.parse(camData);
	misc.createCam(d.x, d.y, d.z, 0, 0, d.rz, d.viewangle);
	misc.prepareToCef();
	misc.openCef("package://RP/Browsers/Business/GasStation/gs.html", lang);
	misc.injectCef(inject);
}


mp.events.add(
{
	"cGasStationMenu" : (lang, inject, camData) => {
		showCef(lang, inject, camData);
	},

	"cGasStationFillUp" : (str) => {
		mp.events.callRemote("sGasStationFillUp", str);
	},

});

