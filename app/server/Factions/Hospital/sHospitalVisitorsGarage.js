const Garage = require('../sGarage');
const i18n = require('../../sI18n');

const garageData = {
	basic: {
		outPos: { x: -515.651, y: -295.108, z: 34.795, rot: 201.06, dim: 0 },
		outBlipId: 50,
		outBlipCol: 1,
		outBlipName: "LS Hospital Garage",
		outBlipScale: 0.7,
		outShapeR: 3,
		startDim: 1,
		floors: 5,
		camData: { x: -514.154, y: -285.073, z: 35.8, rx: 0, ry: 0, rz: 177.02, viewangle: 30 },
	},
	topExit: { x: -460.698, y: -272.399, z: 35.347, rot: 23.34, r: 3, dim: 0 },
	undergroundExit: { x: 224.327, y: -1002.948, z: -98.984, rot: 180.96, r: 3, }, // STATIC
	undergroundCheckCoord: { x: 231.896, y: -1003.318, z: -98.985, rot: 358, r: 3}, // STATIC
	shapesList: [],
	checkShapesList: [],
}

const liftData = {
	topEntrance: { x: 246.519, y: -1372.557, z: 24.50, rot: 316, r: 1, dim: 0 },
	undergroundEntrance: { x: 241.378, y: -1004.781, z: -99, rot: 88.36, r: 1, }, // STATIC
	shapesList: [],
}
const garage = new Garage(garageData, liftData);

garage.enterLift = function(player, floor) {
	if (player.health < 75) return player.notify(`~r~${i18n.get('sHospital', 'needHelp', player.lang)}`);
	const d = garage.getLiftEnterPos(floor);
	player.tp(d);
}