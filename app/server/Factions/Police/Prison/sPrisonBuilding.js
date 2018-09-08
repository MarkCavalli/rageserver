const sBuilding = require('../../sBuilding');
const i18n = require('../../../sI18n');


class PrisonBuilding extends sBuilding {
	constructor() {
		super();
		this.mainEntranceData = {
			outPos: {x: 1846.283, y: 2585.906, z: 45.672, rot: 268.06, dim: 0},
			inPos: {x: 1818.348, y: 2594.317, z: 45.72, rot: 97.25, dim: 0},
	
			outShapeR: 1,
			outMarkerId: 1,
			outMarkerHeightAdjust: -1,
			outMarkerR: 0.75,
			outMarkerCol: [30, 144, 255, 15],

			inShapeR: 1,
			inMarkerId: 1,
			inMarkerHeightAdjust: -1,
			inMarkerR: 0.75,
			inMarkerCol: [30, 144, 255, 15],
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

		this.createMainEntrance();
		this.createSecondEntrance();
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
		player.tp(this.mainEntranceData.inPos);
	}

	exitMainEntrance(player) {
		if (player.vehicle) return;
		player.tp(this.mainEntranceData.outPos);
	}

	enterSecondEntrance(player) {
		if (player.vehicle) return;
		player.startJail();
	}
}
const building = new PrisonBuilding();
module.exports = building;