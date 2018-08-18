"use strict"

const player = mp.players.local;
const misc = require('../cMisc');


class gpsClass {
    constructor() {
        mp.events.add({
			"cGPS-CreateRoute" : (x, y) => {
				mp.game.ui.setNewWaypoint(x, y);
			},
			
		});
    }
}

const gps = new gpsClass();

