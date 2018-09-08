const sBuilding = require('../sBuilding');
const i18n = require('../../sI18n');


class HospitalBuilding extends sBuilding {
	constructor() {
		super();
		this.mainEntranceData = {
			outPos: {x: -498.184, y: -335.741, z: 34.502, rot: 263.72, dim: 0},
			inPos: {x: 275.446, y: -1361.11, z: 24.5378, rot: 46.77, dim: 0},
		
			outBlipId: 153,
			outBlipCol: 1,
			outBlipName: "Hospital",
			outBlipScale: 1,
			outShapeR: 1,
			outMarkerId: 1,
			outMarkerHeightAdjust: -1,
			outMarkerR: 0.75,
			outMarkerCol: [255, 0, 0, 15],

			inShapeR: 1,
			inMarkerId: 1,
			inMarkerHeightAdjust: -1,
			inMarkerR: 0.75,
			inMarkerCol: [255, 0, 0, 15],
		}
		this.createMainEntrance();
		this.createHealingShape();
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
			player.tp(this.mainEntranceData.inPos);
		}
		else if (entranceId === this.mainEntrance.in.entranceId) {
			if (player.vehicle) return;
			if (player.health < 75) return player.notify(`~r~${i18n.get('sHospital', 'needHelp', player.lang)}`);
			player.stopHealing();
			player.tp(this.mainEntranceData.outPos);
		}
	}

	createHealingShape() {
		const startHealCoord = {x: 266.775, y: -1356.136, z: 24.538, rot: 135.53};
		const startHealShape = mp.colshapes.newSphere(startHealCoord.x, startHealCoord.y, startHealCoord.z, 1);
		mp.markers.new(1, new mp.Vector3(startHealCoord.x, startHealCoord.y, startHealCoord.z - 1), 0.75, { color: [255, 0, 0, 15] });

		mp.events.add({
			"playerEnterColshape" : (player, shape) => {
				if (!player.loggedIn || shape !== startHealShape) return;
				player.canStartHeal = true;
				player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('sHospital', 'toStartHealing', player.lang)}`);
			},
		
			"playerExitColshape" : (player, shape) => {
				if (!player.loggedIn || shape !== startHealShape) return;
					player.canStartHeal = false;
			},
		
			"sKeys-E" : (player) => {
				if (!player.loggedIn || !player.canStartHeal) return;
				player.startHealing();
			},
		});
	}

}
const hospitalBuilding = new HospitalBuilding();
module.exports = hospitalBuilding;
