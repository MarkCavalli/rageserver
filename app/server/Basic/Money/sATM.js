const misc = require('../../sMisc');
const i18n = require('../../sI18n');



class ATMSingletone {
	constructor() {
		mp.events.add({
			"playerEnterColshape" : (player, shape) => {
				if (!player.loggedIn || player.vehicle || !shape.atm) return;
				player.canOpen.ATM = true;
				player.notify(i18n.get('sMoney', 'enterATM', player.lang));
			},
			"sKeys-E" : (player) => {
				if (!player.loggedIn || !player.canOpen.ATM) return;
				this.openMenu(player);
			},
			"playerExitColshape" : (player, shape) => {
				if (!player.loggedIn || !shape.atm) return;
				player.canOpen.ATM = false;
			},

			"sMoney-GetCash" : (player, value) => {
				this.getCash(player, value);
			},

			"sMoney-PutCash" : (player, value) => {
				this.putCash(player, value);
			},

			"sMoney-GetTaxMoney" : (player, value) => {
				this.getTaxMoney(player, value);
			},

			"sMoney-PutTaxMoney" : (player, value) => {
				this.putTaxMoney(player, value);
			},

			"sMoney-PayFine" : (player, i) => {
				this.payFine(player, i);
			},
		});
	}
	
	createATM(x, y, z) {
		const shape = mp.colshapes.newSphere(x, y, z, 0.5);
		shape.atm = true;
		mp.blips.new(500, new mp.Vector3(x, y, z),
		{
			name: "ATM",
			color: 2,		
			shortRange: true,
			scale: 0.75,
		});
	}


	getPlayerMoneyInfo(player) {
		const str1 = `app.cash = ${player.money.cash};`;
		const str2 = `app.bank = ${player.money.bank};`;
		const str3 = `app.tax = ${player.money.tax};`;
		const str4 = `app.loadFines('${JSON.stringify(player.money.fines)}');`;
		let totalFine = 0;
		if (Array.isArray(player.money.fines)) {
			for (const fine of player.money.fines) {
				totalFine += fine.val;
			}
		}
		const str5 = `app.fine = ${totalFine};`;
		const str = str1 + str2 + str3 + str4 + str5;
		return str;
	}

	openMenu(player) {
		const str1 = this.getPlayerMoneyInfo(player);
		const str2 = `setTimeout(load, 300);`; // For add transition effect
		const execute = str1 + str2;
		player.call("cMoney-ShowATM", [player.lang, execute]);
		misc.log.debug(`${player.name} enters ATM`);
	}

	loadATMs() {
		this.createATM(-95.54, 6457.14, 31.46);
		this.createATM(-97.26, 6455.38, 31.46);
		this.createATM(155.828, 6642.827, 31.602);
		this.createATM(174.161, 6637.827, 31.573);
		this.createATM(1701.28, 6426.46, 32.76);
		this.createATM(112.483, -818.976, 31.342);
		this.createATM(111.323, -775.486, 31.437);
		this.createATM(114.181, -776.757, 31.418);
		this.createATM(296.444, -893.988, 29.231);
		this.createATM(295.694, -896.069, 29.214);
		this.createATM(147.726, -1035.783, 29.343);
		this.createATM(145.947, -1035.146, 29.345);
		this.createATM(289.01, -1256.83, 29.441);
		this.createATM(1703, 4933.5, 42.06);
		this.createATM(1968.13, 3743.56, 32.34);
		this.createATM(2683, 3286.5, 55.21);
		this.createATM(-611.92, -704.75, 31.26);
		this.createATM(-614.6, -704.75, 31.26);
	}

	updateATMInfo(player) {
		const str = this.getPlayerMoneyInfo(player);
		player.call("cInjectCef", [str]);
	}

	logATMOperation(player, before) {
		player.updateCash();
		const after = `$${player.money.cash} $${player.money.bank} $${player.money.tax}`;
		misc.log.debug(`ATM | ${player.name} | ${before} >>> ${after}`);
	}

	async getCash(player, summ) {
		if (!player.loggedIn || !misc.isValueNumber(summ) || player.money.bank < summ) return;
		const before = `$${player.money.cash} $${player.money.bank} $${player.money.tax}`;
		await misc.query(`UPDATE usersMoney SET cash = cash + ${summ}, bank = bank - ${summ} WHERE id = '${player.guid}'`);
		player.money.cash += summ;
		player.money.bank -= summ;
		this.logATMOperation(player, before);
		this.updateATMInfo(player);
	}

	async putCash(player, summ) {
		if (!player.loggedIn || !misc.isValueNumber(summ) || player.money.cash < summ) return;
		const before = `$${player.money.cash} $${player.money.bank} $${player.money.tax}`;
		await misc.query(`UPDATE usersMoney SET cash = cash - ${summ}, bank = bank + ${summ} WHERE id = '${player.guid}'`);
		player.money.cash -= summ;
		player.money.bank += summ;
		this.logATMOperation(player, before);
		this.updateATMInfo(player);
	}

	async getTaxMoney(player, summ) {
		if (!player.loggedIn || !misc.isValueNumber(summ) || player.money.tax < summ) return;
		const before = `$${player.money.cash} $${player.money.bank} $${player.money.tax}`;
		await misc.query(`UPDATE usersMoney SET cash = cash + ${summ}, tax = tax - ${summ} WHERE id = '${player.guid}'`);
		player.money.cash += summ;
		player.money.tax -= summ;
		this.logATMOperation(player, before);
		this.updateATMInfo(player);
	}

	async putTaxMoney(player, summ) {
		if (!player.loggedIn || !misc.isValueNumber(summ) || player.money.cash < summ) return;
		const before = `$${player.money.cash} $${player.money.bank} $${player.money.tax}`;
		await misc.query(`UPDATE usersMoney SET cash = cash - ${summ}, tax = tax + ${summ} WHERE id = '${player.guid}'`);
		player.money.cash -= summ;
		player.money.tax += summ;
		this.logATMOperation(player, before);
		this.updateATMInfo(player);
	}

	async payFine(player, index) {
		if (!player.loggedIn || !misc.isValueNumber(index) || !player.money.fines[index] || player.money.cash < player.money.fines[index].val) return;
		const before = `$${player.money.cash} $${player.money.bank} $${player.money.tax}`;
		const fineValue = player.money.fines[index].val;
		player.money.cash -= fineValue;
		player.money.fines.splice(index, 1);
		await misc.query(`UPDATE usersMoney SET cash = cash - ${fineValue}, fines = '${JSON.stringify(player.money.fines)}' WHERE id = '${player.guid}'`);
		this.logATMOperation(player, before);
		misc.log.debug(`-$${fineValue} fine`);
		this.updateATMInfo(player);
	}

}
const atmSingletone = new ATMSingletone();
atmSingletone.loadATMs();

function getNearestATM(playerPosition) {
	const atms = mp.blips.toArray();
	let nearestATM = atms[0];
	for (const atm of atms) {
		if (atm.name !== "ATM") continue;
		if (atm.dist(playerPosition) < nearestATM.dist(playerPosition)) {
			nearestATM = atm;
		}
	}
	return nearestATM.position;
}
module.exports.getNearestATM = getNearestATM;
