
const sBuilding = require('../sBuilding');
const i18n = require('../../sI18n');


class PoliceBuilding extends sBuilding {
	constructor() {
		super();
		this.mainEntranceData = {
			outPos: {x: -1107.097, y: -846.088, z: 19.317, rot: 129.39, dim: 0},
			inPos: {x: 437.286, y: -978.417, z: 30.69, rot: 178.7, dim: 0},
		
			outBlipId: 461,
			outBlipCol: 3,
			outBlipName: "LS Police Department",
			outBlipScale: 1,
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
		this.createMainEntrance();
	}

	createMainEntrance() {
		this.mainEntrance = super.createDoubleEntrance(this.mainEntranceData);
	}

	enteredBuildingShape(player, entranceId) {
		if (entranceId === this.mainEntrance.out.entranceId) {
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toEnter', player.lang)}`);
		}
		else if (entranceId === this.mainEntrance.in.entranceId) {
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toExit', player.lang)}`);
		}
	}

	tryToEnter(player, entranceId) {
		if (entranceId === this.mainEntrance.out.entranceId) {
			if (player.vehicle) return;
			return player.tp(this.mainEntranceData.inPos);
		}
		else if (entranceId === this.mainEntrance.in.entranceId) {
			if (player.vehicle) return;
			player.tp(this.mainEntranceData.outPos);
		}
	}

}
const building = new PoliceBuilding();
module.exports = building;