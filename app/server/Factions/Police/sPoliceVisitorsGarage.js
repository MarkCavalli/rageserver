const Garage = require('../sGarage');

const garageData = {
	basic: {
		outPos: { x: -1121.295, y: -843.354, z: 12.966, rot: 310.88, dim: 0 },
		outBlipId: 50,
		outBlipCol: 3,
		outBlipName: "LS Police Department Garage",
		outBlipScale: 0.7,
		outShapeR: 3,
		startDim: 11,
		floors: 5,
		camData: { x: -1130.153, y: -846.02, z: 13.577, rx: 0, ry: 0, rz: 299.78, viewangle: 30 },
	},
	topExit: { x: -1124.514, y: -839.376, z: 12.981, rot: 129.81, r: 3, dim: 0 },
	undergroundExit: { x: 224.327, y: -1002.948, z: -98.984, rot: 180.96, r: 3, }, // STATIC
	undergroundCheckCoord: { x: 231.896, y: -1003.318, z: -98.985, rot: 358, r: 3}, // STATIC
	shapesList: [],
	checkShapesList: [],
}

const liftData = {
	topEntrance: {x: 445.839, y: -996.392, z: 30.69, rot: 10, r: 1, dim: 0 },
	undergroundEntrance: {x: 241.378, y: -1004.781, z: -99, rot: 88.36, r: 1, }, // STATIC
	shapesList: [],
}
new Garage(garageData, liftData);
