"use strict"

const misc = require('../sMisc');

let cantBuyText, paymentText, taxPaymentText, enterText;
function updateLanguage(player) {
	cantBuyText = "Not enough cash!";
	paymentText = "New payment:";
	taxPaymentText = "New tax payment:";
	enterText = `Press ~b~E ~s~to open ATM Menu`;

	const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
		cantBuyText = "Недостаточно наличных!";
		paymentText = "Новый чек:";
		taxPaymentText = "Новый налоговый чек:";
		enterText = `Нажмите ~b~E ~s~для входа в меню банкомата`;
	}
	else if (lang === "ger") {
		cantBuyText = "Nicht genug Geld!";
		paymentText = "Neue zahlung:";
		taxPaymentText = "Neue tax zahlung:"; // Need update
		enterText = `Press ~b~E ~s~to open ATM Menu`; // Need update
	}

}




async function getMoney(player) {
   	const d = await misc.query(`SELECT money FROM users WHERE username = '${player.name}'`);
	player.call("cMoneyUpdate", [d[0].money]);
	return d[0].money;
};
module.exports.getMoney = getMoney;

async function changeMoney(player, value) {
	if (!misc.isValueNumber(value)) {
		misc.log.error(`changeMoney | Money is not a number: ${value}`);
		return false;
	}

	if (player.info.money + value < 0) {
		updateLanguage(player);
		player.notify("~r~" +cantBuyText);
		return false;
	}
	await misc.query(`UPDATE users SET money = money + ${value} WHERE username = '${player.name}'`);
	player.info.money += value;
	player.call("cMoneyUpdate", [player.info.money]);
	return true;
};
module.exports.changeMoney = changeMoney;

async function addToBankMoneyOffline(name, value, comment) {
	if (!misc.isValueNumber(value) || value < 0) return;
	await misc.query(`UPDATE users SET bmoney = bmoney + ${value} WHERE username = '${name}'`);
	for (let j = 0; j < mp.players.length; j++) {
		const player = mp.players.at(j);
		if (player.name === name) {
			player.info.bmoney += value;

			updateLanguage(player);
			player.call("cMoneySendNotification", [`${paymentText} ~g~$${value}. ~w~${comment}`]);
			break;
		}
	}
}
module.exports.addToBankMoneyOffline = addToBankMoneyOffline;

async function payTaxOffline(username, value, comment) {
	if (!misc.isValueNumber(value) || value < 0) return;
	const d = await misc.query(`SELECT tmoney FROM users WHERE username = '${username}'`);
	if (value > d[0].tmoney) {
		return false;
	}
	await misc.query(`UPDATE users SET tmoney = tmoney - ${value} WHERE username = '${username}'`);
	for (let j = 0; j < mp.players.length; j++) {
		const player = mp.players.at(j);
		if (player.name === username) {
			player.info.tmoney -= value;
			updateLanguage(player);
			player.call("cMoneySendNotification", [`${taxPaymentText} ~g~$${value}. ~w~${comment}`]);
			break;
		}
	}
	return true;
}
module.exports.payTaxOffline = payTaxOffline;


async function getCash(player, summ) {
	if (!misc.isValueNumber(summ) || player.info.bmoney < summ) {
		return;
	}
	const before = `$${player.info.money} $${player.info.bmoney} $${player.info.tmoney}`;
	await misc.query(`UPDATE users SET money = money + ${summ}, bmoney = bmoney - ${summ} WHERE username = '${player.name}'`);
	player.info.money += summ;
	player.info.bmoney -= summ;
	player.call("cMoneyUpdate", [player.info.money]);
	logATMOperation(player, before);
}

async function putCash(player, summ) {
	if (!misc.isValueNumber(summ) || player.info.money < summ) {
		return;
	}
	const before = `$${player.info.money} $${player.info.bmoney} $${player.info.tmoney}`;
	await misc.query(`UPDATE users SET money = money - ${summ}, bmoney = bmoney + ${summ} WHERE username = '${player.name}'`);
	player.info.money -= summ;
	player.info.bmoney += summ;
	player.call("cMoneyUpdate", [player.info.money]);
	logATMOperation(player, before);
}

async function getTaxMoney(player, summ) {
	if (!misc.isValueNumber(summ) || player.info.tmoney < summ) {
		return;
	}
	const before = `$${player.info.money} $${player.info.bmoney} $${player.info.tmoney}`;
	await misc.query(`UPDATE users SET money = money + ${summ}, tmoney = tmoney - ${summ} WHERE username = '${player.name}'`);
	player.info.money += summ;
	player.info.tmoney -= summ;
	player.call("cMoneyUpdate", [player.info.money]);
	logATMOperation(player, before);
}

async function putTaxMoney(player, summ) {
	if (!misc.isValueNumber(summ) || player.info.money < summ) {
		return;
	}
	const before = `$${player.info.money} $${player.info.bmoney} $${player.info.tmoney}`;
	await misc.query(`UPDATE users SET money = money - ${summ}, tmoney = tmoney + ${summ} WHERE username = '${player.name}'`);
	player.info.money -= summ;
	player.info.tmoney += summ;
	player.call("cMoneyUpdate", [player.info.money]);
	logATMOperation(player, before);
}

function logATMOperation(player, before) {
	const after = `$${player.info.money} $${player.info.bmoney} $${player.info.tmoney}`;
	misc.log.debug(`ATM | ${player.name} | ${before} > ${after}`);
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

	"sKeys-E" : (player) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		if (player.info.canOpen.ATM) {
			openATMMenu(player);
		}
	},
	
	
});






function CreateATM(x, y, z) {
	const colshape = mp.colshapes.newSphere(x, y, z, 0.5);
	colshape.setVariable("ATM", true);
	const Blip = mp.blips.new(500, new mp.Vector3(x, y, z),
	{
		name: "ATM",
		color: 2,		
		shortRange: true,
		scale: 0.75,
	});
}

function openATMMenu(player) {
	const str1 = `app.cash = ${player.info.money};`;
	const str2 = `app.bmoney = ${player.info.bmoney};`;
	const str3 = `app.tmoney = ${player.info.tmoney};`;
	const str4 = `setTimeout(load, 300);`; // For add transition effect

	const execute = str1 + str2 + str3 + str4;

	const lang = misc.getPlayerLang(player);
	player.call("cShowATMCef", [lang, execute]);
	misc.log.debug(`${player.name} enters ATM`);
}


mp.events.add(
{
	"playerEnterColshape" : (player, shape) => {
		if (!shape.getVariable("ATM") || player.vehicle || !misc.isPlayerLoggedIn(player)) {
			return;
		}
		player.info.canOpen.ATM = true;
		updateLanguage(player);
		player.notify(enterText);
	},

	"playerExitColshape" : (player, shape) => {
		if (!shape.getVariable("ATM")) {
			return;
		}
		player.info.canOpen.ATM = false;
	},
	
});



CreateATM(-95.54, 6457.14, 31.46); // bank pb
CreateATM(-97.26, 6455.38, 31.46); // bank pb
CreateATM(-254.56, 6338.20, 32.42); // hospital
CreateATM(155.828, 6642.827, 31.602); // petrolstation with customs
CreateATM(174.161, 6637.827, 31.573); // petrolstation with customs
CreateATM(1701.28, 6426.46, 32.76); // petrolstation


