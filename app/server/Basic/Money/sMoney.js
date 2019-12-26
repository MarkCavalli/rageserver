const misc = require('../../sMisc');
const i18n = require('../../sI18n');



class MoneySingletone {
	async createNewUser(id) {
		await misc.query(`INSERT INTO usersMoney (id, cash, fines) VALUES ('${id}', '1500', '[]');`);
	}

	async loadUser(player) {
		const d = await misc.query(`SELECT * FROM usersMoney WHERE id = '${player.guid}' LIMIT 1`);
		player.money = {
			cash: d[0].cash,
			bank: d[0].bank,
			tax: d[0].tax,
			fines: JSON.parse(d[0].fines),
		}

		player.updateCash = function() {
			this.call("cMoney-Update", [this.money.cash]);
		}
		player.updateCash();

		player.changeMoney = async function(value) {
			if (!misc.isValueNumber(value)) return false;
			if (this.money.cash + value < 0) {
				this.notify(`~r~${i18n.get('sMoney', 'notEnoughCash', this.lang)}!`);
				return false;
			}
			await misc.query(`UPDATE usersMoney SET cash = cash + ${value} WHERE id = '${this.guid}'`);
			this.money.cash += value;
			this.updateCash();
			return true;
        }
		
		player.addBankMoney = async function(value, comment) {
			if (!misc.isValueNumber(value) || value < 0) return;
			await misc.query(`UPDATE usersMoney SET bank = bank + ${value} WHERE id = '${this.guid}' LIMIT 1`);
			this.money.bank += value;
			this.call("cMoney-SendNotification", [`${i18n.get('sMoney', 'addBankMoney', this.lang)}: ~g~$${value}. ~w~${comment}`]);
		}

		player.payTax = async function(value, comment) {
			if (!misc.isValueNumber(value) || value < 0) return;
			if (value > this.money.tax) return false;
			await misc.query(`UPDATE usersMoney SET tax = tax - ${value} WHERE id = '${this.guid}'`);
			this.money.tax -= value;
			this.call("cMoney-SendNotification", [`${i18n.get('sMoney', 'payTaxOffline', this.lang)}: ~g~$${value}. ~w~${comment}`]);
			return true;
		}

		player.newFine = function(value, comment) {
			if (!misc.isValueNumber(value) || value < 0) return;
			const newFine = {
				date: new Date().toLocaleString(),
				val: value,
				txt: comment,
			}
			misc.query(`UPDATE usersMoney SET fines = '${JSON.stringify(this.money.fines)}' WHERE id = '${this.guid}'`);
			this.money.fines.push(newFine);
			this.call("cMoney-SendNotification", [`${i18n.get('sMoney', 'newFine', this.lang)}: ~r~$${value}. ~w~${comment}`]);
			misc.log.debug(`New fine: ${player.name}, $${value}, ${comment}`);
		}
	}

	async addBankMoneyOffline(guid, value) {
		await misc.query(`UPDATE usersMoney SET bank = bank + ${value} WHERE id = '${guid}' LIMIT 1`);
	}

	async payTaxOffline(guid, value) {
		const d = await misc.query(`SELECT tax FROM usersMoney WHERE id = '${guid}' LIMIT 1`);
		if (!d[0] || value > d[0].tax) return false;
		await misc.query(`UPDATE usersMoney SET tax = tax - ${value} WHERE id = '${guid}' LIMIT 1`);
		return true;
	}

	getNearestATM(playerPosition) {
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

}
const moneySingletone = new MoneySingletone();
module.exports = moneySingletone;


mp.events.addCommand({	
	'givecash' : (admin, fullText, id, value) => {
		if (admin.adminlvl < 1) return;
		const player = mp.players.at(+id);
		if (!player) return admin.outputChatBox(`!{200, 0, 0}Player does not exist!`);
		player.changeMoney(+value);
		admin.outputChatBox(`!{0, 200, 0}You gave $${+value} to ${player.name}!`);
		player.outputChatBox(`!{0, 200, 0}${admin.name} gave you $${+value}!`);
		misc.log.info(`${admin.name} give ${player.name} $${+value}`);
	},

});