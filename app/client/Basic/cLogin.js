"use strict"

const misc = require('../cMisc');
const player = mp.players.local;

function showCef(url) {
	misc.prepareToCef(1);
	misc.createCam(3223, 5349, 14, 0, 0, 218, 20);
	misc.openCef(url);
}
mp.discord.update('Developing server');
mp.events.add(
{
	"cShowLoginCef" : (url) => {
		showCef(url);
	},
	
	"cTryRegister" : (pass, skey) => {
		mp.events.callRemote('sTryRegister', pass, skey);
	},

	"cTryLogin" : (pass) => {
		mp.events.callRemote('sTryLogin', pass);
	},

	"cTrycLogin" : (pass, skey) => {
		mp.events.callRemote('sTrycLogin', pass, skey);
	},

});

