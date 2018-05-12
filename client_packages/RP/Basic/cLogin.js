"use strict"

const misc = require('/RP/cMisc');
const player = mp.players.local;

function showCef(url) {
	misc.prepareToCef(1);
	misc.createCam(3223, 5349, 14, 0, 0, 218, 20);
	misc.openCef(url);
}

mp.events.add(
{
	"cShowLoginCef" : (url) => {
		showCef(url);
	},
	
	"cTryRegister" : (pass) => {
		mp.events.callRemote('sTryRegister', pass);
	},

	"cTryLogin" : (pass) => {
		mp.events.callRemote('sTryLogin', pass);
	},

});

