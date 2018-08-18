"use strict"

const sBuilding = require('../sBuilding');
const misc = require('../../sMisc');
const i18n = require('../../sI18n');
const clothes = require('../../Character/sClothes');



class sPrisonBuilding extends sBuilding {
	constructor() {
		super();
		this.mainEntranceData = {
			outPos: {x: 1846.283, y: 2585.906, z: 45.672, rot: 268.06, dim: 0},
			inPos: {x: 1818.348, y: 2594.317, z: 45.72, rot: 97.25, dim: 0},
	
			outShapeR: 1,
			outMarkerId: 1,
			outMarkerHeightAdjust: -1,
			outMarkerR: 0.75,
			outMarkerCol: [0, 0, 255, 15],

			inShapeR: 1,
			inMarkerId: 1,
			inMarkerHeightAdjust: -1,
			inMarkerR: 0.75,
			inMarkerCol: [0, 0, 255, 15],
		}

		this.secondEntranceData = {
			outPos: {x: 1690.713, y: 2591.354, z: 45.914, rot: 0, dim: 0},
			inPos: {x: 1689.259, y: 2529.241, z: 45.565, rot: 183.25, dim: 0},
		
			outBlipId: 188,
			outBlipCol: 3,
			outBlipName: "Prison",
			outBlipScale: 1,
			outShapeR: 1,
		}


	}

	createMainEntrance() {
		this.mainEntrance = super.createDoubleEntrance(this.mainEntranceData);
	}

	createSecondEntrance() {
		this.secondEntrance = super.createSingleEntrance(this.secondEntranceData);
	}

	enteredBuildingShape(player, entranceId) {
		if (entranceId === this.mainEntrance.out.entranceId) {
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toEnter', player.lang)}`);
		}
		else if (entranceId === this.secondEntrance.out.entranceId) {
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} to surrender`);
		}
		else if (entranceId === this.mainEntrance.in.entranceId) {
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toExit', player.lang)}`);
		}
	}

	tryToEnter(player, entranceId) {
		if (entranceId === this.mainEntrance.out.entranceId) {
			this.enterMainEntrance(player);
		}
		else if (entranceId === this.secondEntrance.out.entranceId) {
			this.enterSecondEntrance(player);
		}
		else if (entranceId === this.mainEntrance.in.entranceId) {
			this.exitMainEntrance(player);
		}
		
	}

	enterMainEntrance(player) {
		if (player.vehicle) return;
		this.enter(player, this.mainEntranceData.inPos);
	}

	exitMainEntrance(player) {
		if (player.vehicle) return;
		this.enter(player, this.mainEntranceData.outPos);
	}

	enterSecondEntrance(player) {
		if (player.vehicle) return;
		prison.startJail(player);
	}

	


}
function loadBuildingClass() {
	const building = new sPrisonBuilding();
	building.createMainEntrance();
	building.createSecondEntrance();
	return building;
}
const building = loadBuildingClass();




class sPrison {
	constructor() {
		mp.events.add({
			"playerDeath" : (player, reason, killer) => {
				if (!killer || player === killer) return;
				this.addViolation(killer, 5, "You killed a civilian");
			},

		});
	}

	async loadPlayerAccount(player) {
		if (!player.loggedIn) return;
		const d = await misc.query(`SELECT * FROM jail WHERE id = '${player.basic.id}' LIMIT 1`);
		player.jail = {
			inside: d[0].inside,
			time: d[0].time,
			violations: JSON.parse(d[0].violations),
		}
		this.updateWantedLevel(player);
	}

	isInsideJail(player) {
		return player.jail.inside;
	}

	isWanted(player) {
		const d = player.jail.violations.length;
		if (d > 0) {
			return true;
		}
		return false;
	}

	updateWantedLevel(player) {
		const d = player.jail.violations.length;
		let lvl = 0;
		if (d > 0) lvl = 5;
		player.call("cPrison-SetWantedLevel", [lvl]);
	}

	addViolation(player, time, comment) {
		if (!player.loggedIn) return;
		const newViolation = {
			time: time,
			text: comment,
		}
		player.jail.violations.push(newViolation);
		player.call("cPrison-SendNotification", [`${comment} | ${time} min`]);
		this.updateWantedLevel(player);
		misc.log.debug(`${player.name} get new violation: ${comment} | ${time}`);
	}

	startJail(player) {
		if (!player.loggedIn) return;
		if (player.jail.violations.length === 0) return player.notify("You have no violations!");
		building.enter(player, building.secondEntranceData.inPos);
		let jailTime = 0;
		for (let violation of player.jail.violations) {
			player.outputChatBox(`${violation.text} | ${violation.time} minutes`);
			jailTime += violation.time;
		}
		player.outputChatBox(`Total time: !{225, 0, 0}${jailTime} minutes`);
		player.jail.inside = 1;
		player.jail.time = jailTime;
		player.jail.violations = [];
		if (player.model === 1885233650) {
			this.setManClothes(player);
		}
		else {
			this.setWomanClothes(player);
		}
		misc.log.debug(`${player.name} start jail. Time ${jailTime} m`);
	}

	everyMinuteEvent() {
		const players = mp.players.toArray();
		for (let player of players) {
			if (!player.loggedIn || !this.isInsideJail(player)) continue;
			this.removeOneMinuteFromJailTime(player);
		}
	}

	removeOneMinuteFromJailTime(player) {
		const dist = player.dist(new mp.Vector3(1689, 2529, 45.5));
		if (dist > 300) return this.escapeEvent(player);
		player.jail.time -= 1;
		if (player.jail.time === 0) return this.endJail(player);
		player.notify(`Remaining time: ~r~${player.jail.time} minutes`);
		misc.log.debug(`${player.name} jail remaining time: ${player.jail.time} m`);
	}

	escapeEvent(player) {
		this.addViolation(player, player.jail.time * 3, 'Escape');
		player.jail.inside = 0;
		player.jail.time = 0;
	}

	endJail(player) {
		player.position = new mp.Vector3(1792.563, 2593.779, 45.796);
		player.heading = 263.45;
		player.jail.inside = 0;
		player.outputChatBox(`!{0, 225, 0}Now you are free!`);
		this.updateWantedLevel(player);
		clothes.loadPlayerClothes(player);
		misc.log.debug(`${player.name} ended jail`);
	}

	savePlayerAccount(player) {
		misc.query(`UPDATE jail SET inside = '${player.jail.inside}', time = '${player.jail.time}', violations = '${JSON.stringify(player.jail.violations)}' WHERE id = '${player.basic.id}'`);
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

}
const prison = new sPrison();

function loadPlayerAccount(player) {
	prison.loadPlayerAccount(player);
}
module.exports.loadPlayerAccount = loadPlayerAccount;

function everyMinuteEvent() {
	prison.everyMinuteEvent();
}
module.exports.everyMinuteEvent = everyMinuteEvent;

function isWanted(player) {
	return prison.isWanted(player);
}
module.exports.isWanted = isWanted;

function savePlayerAccount(player) {
	prison.savePlayerAccount(player);
}
module.exports.savePlayerAccount = savePlayerAccount;


async function insertNewUser() {
	await misc.query(`INSERT INTO jail (violations) VALUES ('${JSON.stringify([])}')`);
}
module.exports.insertNewUser = insertNewUser;