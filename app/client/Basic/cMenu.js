"use strict"

const player = mp.players.local;
const misc = require('../cMisc');


class menu {
    constructor() {
        mp.events.add({
			"cMenu-Open" : (lang, inject) => {
				misc.prepareToCef(1);
				misc.openCef("package://RP/Browsers/Menu/Menu.html", lang);
				misc.injectCef(inject);
			},
			
		});
    }
}

const m = new menu();