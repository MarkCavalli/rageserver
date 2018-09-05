const misc = require('../cMisc');

mp.events.add({

	"cGarage-ShowVisitorsGarageMenu" : (lang, execute, cam) => {
		misc.prepareToCef(1);
		misc.openCef("package://RP/Browsers/Factions/VisitorsGarage/Garage/garage.html", lang);
		misc.injectCef(execute);
		const c = JSON.parse(cam);
		misc.createCam(c.x, c.y, c.z, c.rx, c.ry, c.rz, c.viewangle);
	},

	"cGarage-ShowVisitorsLiftMenu" : (lang, execute) => {
		misc.prepareToCef(1);
		misc.openCef("package://RP/Browsers/Factions/VisitorsGarage/Lift/lift.html", lang);
		misc.injectCef(execute);
	},
});

