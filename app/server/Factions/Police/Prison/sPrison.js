const misc = require('../../../sMisc');
const clothes = require('../../../Character/sClothes');
const building = require('./sPrisonBuilding');


class Prison {
	constructor() {
		mp.events.add({
			"playerDeath" : (player, reason, killer) => {
				if (!killer || player === killer) return;
				killer.addViolation(5, "You killed a civilian");
			},

		});
	}

	async createNewUser(id) {
		await misc.query(`INSERT INTO usersJail (id, violations) VALUES ('${id}', '${JSON.stringify([])}')`);
	}

	async loadUser(player) {
		const d = await misc.query(`SELECT * FROM usersJail WHERE id = '${player.guid}' LIMIT 1`);
		player.jail = {
			inside: d[0].inside,
			time: d[0].time,
			violations: JSON.parse(d[0].violations),
		}

		player.isWanted = function() {
			if (this.jail.violations.length > 0) return true;
			return false;
		}

		player.updateWantedLevel = function() {
			if (!this.isWanted()) this.call("cPrison-SetWantedLevel", [0]);
			else this.call("cPrison-SetWantedLevel", [5]);
		}
		player.updateWantedLevel();

		player.addViolation = function(time, comment) {
			if (!this.loggedIn) return;
			const newViolation = { time, comment };
			this.jail.violations.push(newViolation);
			this.call("cPrison-SendNotification", [`${comment} | ${time} min`]);
			this.updateWantedLevel();
			misc.log.debug(`${this.name} get new violation: ${comment} | ${time}`);	
		}

		player.startJail = function() {
			if (this.jail.violations.length === 0) return this.notify("You have no violations!");
			player.tp(building.secondEntranceData.inPos);
			let jailTime = 0;
			for (const violation of this.jail.violations) {
				this.outputChatBox(`${violation.text} | ${violation.time} minutes`);
				jailTime += violation.time;
			}
			this.outputChatBox(`Total time: !{225, 0, 0}${jailTime} minutes`);
			this.jail.inside = 1;
			this.jail.time = jailTime;
			this.jail.violations = [];
			if (this.model === 1885233650) prison.setManClothes(player);
			else prison.setWomanClothes(player);
			misc.log.debug(`${this.name} start jail. Time ${jailTime} m`);
		}

		player.jailEvent = function() {
			if (!this.jail.inside) return;
			const dist = this.dist(new mp.Vector3(1689, 2529, 45.5));
			if (dist > 280) return prison.escapeEvent(player);
			this.jail.time -= 1;
			if (this.jail.time === 0) return this.endJail();
			this.notify(`Remaining time: ~r~${this.jail.time} minutes`);
			misc.log.debug(`${this.name} jail remaining time: ${this.jail.time} m`);
		}

		player.endJail = function() {
			this.position = new mp.Vector3(1792.563, 2593.779, 45.796);
			this.heading = 263.45;
			this.jail.inside = 0;
			this.outputChatBox(`!{0, 225, 0}Now you are free!`);
			this.updateWantedLevel();
			clothes.loadPlayerClothes(this);
			misc.log.debug(`${this.name} ended jail`);
		}

	}

	escapeEvent(player) {
		player.addViolation(player.jail.time * 3, 'Escape');
		player.jail.inside = 0;
		player.jail.time = 0;
	}

	setManClothes(player) {
		player.setClothes(11, 5, 0, 0); // tops
		player.setClothes(3, 5, 0, 0);
		player.setClothes(8, 5, 0, 0);

		player.setClothes(4, 3, 7, 0); // legs

		player.setClothes(6, 5, 0, 0); // shoes
	}

	setWomanClothes(player) {
		player.setClothes(11, 5, 0, 0); // tops
		player.setClothes(3, 4, 0, 0);
		player.setClothes(8, 5, 0, 0);

		player.setClothes(4, 3, 15, 0); // legs

		player.setClothes(6, 5, 0, 0); // shoes
	}

	savePlayerAccount(player) {
		misc.query(`UPDATE usersJail SET inside = '${player.jail.inside}', time = '${player.jail.time}', violations = '${JSON.stringify(player.jail.violations)}' WHERE id = '${player.guid}'`);
	}

}
const prison = new Prison();
module.exports = prison;

