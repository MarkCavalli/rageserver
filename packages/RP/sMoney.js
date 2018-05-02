"use strict"

const misc = require('./sMisc');

async function getMoney(player) {
   	const d = await misc.query(`SELECT money FROM users WHERE username = '${player.name}'`);
	player.call("cMoneyUpdate", [d[0].money]);
	return d[0].money;
};
module.exports.getMoney = getMoney;