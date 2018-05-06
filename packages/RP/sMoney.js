"use strict"

const misc = require('./sMisc');

async function getMoney(player) {
   	const d = await misc.query(`SELECT money FROM users WHERE username = '${player.name}'`);
	player.call("cMoneyUpdate", [d[0].money]);
	return d[0].money;
};
module.exports.getMoney = getMoney;



async function getCash(player, summ) {
	if (!misc.isValueNumber(summ)) return;
	const d = await misc.query(`SELECT money, bmoney FROM users WHERE username = '${player.name}'`);
	if (d[0].bmoney < summ) return;
	await misc.query(`UPDATE users SET money = money + ${summ}, bmoney = bmoney - ${summ} WHERE username = '${player.name}'`);
	player.call("cMoneyUpdate", [d[0].money += summ]);
}

async function putCash(player, summ) {
	if (!misc.isValueNumber(summ)) return;
	const d = await misc.query(`SELECT money, bmoney FROM users WHERE username = '${player.name}'`);
	if (d[0].money < summ) return;
	await misc.query(`UPDATE users SET money = money - ${summ}, bmoney = bmoney + ${summ} WHERE username = '${player.name}'`);
	player.call("cMoneyUpdate", [d[0].money -= summ]);
}

async function getTaxMoney(player, summ) {
	if (!misc.isValueNumber(summ)) return;
	const d = await misc.query(`SELECT money, tmoney FROM users WHERE username = '${player.name}'`);
	if (d[0].tmoney < summ) return;
	await misc.query(`UPDATE users SET money = money + ${summ}, tmoney = tmoney - ${summ} WHERE username = '${player.name}'`);
	player.call("cMoneyUpdate", [d[0].money += summ]);
}

async function putTaxMoney(player, summ) {
	if (!misc.isValueNumber(summ)) return;
	const d = await misc.query(`SELECT money, tmoney FROM users WHERE username = '${player.name}'`);
	if (d[0].money < summ) return;
	await misc.query(`UPDATE users SET money = money - ${summ}, tmoney = tmoney + ${summ} WHERE username = '${player.name}'`);
	player.call("cMoneyUpdate", [d[0].money -= summ]);
}

mp.events.add(
	{		
		"sGetCash" : (player, summ) => {
			getCash(player, summ);
		},

		"sPutCash" : (player, summ) => {
			putCash(player, summ);
		},

		"sGetTaxMoney" : (player, summ) => {
			getTaxMoney(player, summ);
		},

		"sPutTaxMoney" : (player, summ) => {
			putTaxMoney(player, summ);
		},

		
		
	});




function CreateATM(x, y, z) {
	const colshape = mp.colshapes.newSphere(x, y, z, 0.1);
	colshape.setVariable("ATM", true);
	const Blip = mp.blips.new(500, new mp.Vector3(x, y, z),
	{
		name: "ATM",
		color: 2,		
		shortRange: true,
		scale: 0.75,
	});
}


mp.events.add(
{
	"playerEnterColshape" : async (player, shape) => {
		if (shape.getVariable("ATM") && !player.vehicle) {
			let d = await misc.query(`SELECT money, bmoney, tmoney FROM users WHERE username = '${player.name}'`);
			const str1 = `app.cash = ${d[0].money};`;
			const str2 = `app.bmoney = ${d[0].bmoney};`;
			const str3 = `app.tmoney = ${d[0].tmoney};`;
			const str4 = `setTimeout(load, 300);`; // For add transition effect
			const str = str1 + str2 + str3 + str4;
			player.call("cShowATMCef", ["package://RP/Browsers/ATM/atm.html"]);
			player.call("cInjectCef", [str]);	
		}
	},
	
});



CreateATM(-95.54, 6457.14, 31.46); // bank pb
CreateATM(-97.26, 6455.38, 31.46); // bank pb
CreateATM(-254.56, 6338.20, 32.42); // hospital
CreateATM(155.828, 6642.827, 31.602); // petrolstation with customs
CreateATM(174.161, 6637.827, 31.573); // petrolstation with customs
CreateATM(1701.28, 6426.46, 32.76); // petrolstation


