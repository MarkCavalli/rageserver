"use strict";

const misc = require('../cMisc');
const player = mp.players.local;

mp.events.add(
{
	"cBarberShop-ShowBuyerMenu" : (lang, inject, camD) => {
		misc.prepareToCef();
		misc.openCef("package://RP/Browsers/Business/BarberShop/bs.html", lang);
		misc.injectCef(inject);
		misc.createCam(camD.x, camD.y, camD.z, camD.rx, camD.ry, camD.rz, camD.viewangle);
	},

	"cBarberShop-SetHairColor" : (col1, col2) => player.setHairColor(col1, col2)
});
