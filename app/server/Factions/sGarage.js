
const i18n = require('../sI18n');
const sBuilding = require('./sBuilding');
const misc= require('../sMisc');

/*
const garageData = {
	basic: {
		outPos: { x: -1121.295, y: -843.354, z: 12.966, rot: 310.88, dim: 0 },
		outBlipId: 50,
		outBlipCol: 3,
		outBlipName: "LS Police Department Garage",
		outBlipScale: 0.7,
		outShapeR: 3,
		startDim: 1,
		floors: 5,
		camData: { x: -514.154, y: -285.073, z: 35.8, rx: 0, ry: 0, rz: 177.02, viewangle: 30 },
	},
	topExit: { x: 445.839, y: -996.392, z: 30.69, rot: 10, r: 3, dim: 0 },
	undergroundExit: { x: -1124.848, y: -839.704, z: 12.993, rot: 131.1, r: 3, }, // STATIC
	undergroundCheckCoord: { x: 231.896, y: -1003.318, z: -98.985, rot: 358, r: 3}, // STATIC
	shapesList: [],
	checkShapesList: [],
}

const liftData = {
	topEntrance: {x: 445.839, y: -996.392, z: 30.69, rot: 189.97, r: 1, dim: 0 },
	undergroundEntrance: {x: 241.378, y: -1004.781, z: -99, rot: 88.36, r: 1, }, // STATIC
	shapesList: [],
}
*/

class sGarage extends sBuilding {
	constructor(garage, lift) {
		super();
		this.garage = garage;
		this.lift = lift;
		this.createGarage();
	}

	createGarage() {
		this.mainEnter = super.createSingleEntrance(this.garage.basic);
		this.createCheckShape(this.garage.topExit, this.garage.topExit.dim);
		let liftShape = this.createEntranceShape(this.lift.topEntrance, this.lift.topEntrance.dim);
		this.lift.shapesList.push(liftShape);

		for (let i = this.garage.basic.startDim; i < this.garage.basic.startDim + this.garage.basic.floors; i++) {
			const garageShape = this.createEntranceShape(this.garage.undergroundExit, i);
			this.garage.shapesList.push(garageShape);
			this.createCheckShape(this.garage.undergroundCheckCoord, i);

			liftShape = this.createEntranceShape(this.lift.undergroundEntrance, i);

			this.lift.shapesList.push(liftShape);
		}
	}

	createEntranceShape(pos, dim) {
		const mainEntrance = {
			outPos: { x: pos.x, y: pos.y, z: pos.z, rot: pos.rot, dim },
			outShapeR: pos.r,
		}
		const shape = super.createSingleEntrance(mainEntrance);
		return shape.out;
	}

	createCheckShape(pos, dim) {
		const shape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, pos.r);
		shape.dimension = dim;
		this.garage.checkShapesList.push(shape);
		return shape;
	}
	
	enteredBuildingShape(player, entranceId) {
		if (entranceId === this.mainEnter.out.entranceId) {
			if (!player.isDriver()) return;
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toEnterGarage', player.lang)}`);
		}
		else if (this.isExitShapeValid(this.garage.shapesList, entranceId)) {
			if (!player.isDriver()) return;
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toExitGarage', player.lang)}`);
		}
		else if (this.isExitShapeValid(this.lift.shapesList, entranceId)) {
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toCallLift', player.lang)}`);
		}
	}

	isExitShapeValid(list, id) {
		for (let i = 0; i < list.length; i++) {
			if (list[i].entranceId === id) return true;
		}
		return false;
	}

	isCheckShapeClear(player, shape) {
		const vehicles = mp.vehicles.toArray();
		for (const vehicle of vehicles) {
			if (shape.isPointWithin(vehicle.position) && shape.dimension === vehicle.dimension) {
				player.notify(`~r~${i18n.get('basic', 'someVehicleIsBlocking', player.lang)}!`);
				return false;
			}
		}
		const players = mp.players.toArray();
		for (const p of players) {
			if (shape.isPointWithin(p.position)  && shape.dimension === p.dimension) {
				player.notify(`~r~${i18n.get('basic', 'somePlayerIsBlocking', player.lang)}!`);
				return false;
			}
		}
		return true;
	}

	getGarageEnterPos(floor) {
		if (!misc.isValueNumber(floor)) return false;
		const pos = this.garage.undergroundCheckCoord;
		pos.dim = this.garage.basic.startDim + Math.abs(floor) - 1;
		pos.checkShape = this.garage.checkShapesList[Math.abs(floor)];
		return pos;
	}

	getLiftEnterPos(floor) {
		if (!misc.isValueNumber(floor)) return;
		let pos;
		if (floor === 0) {
			pos = this.lift.topEntrance;
			pos.dim = 0;
		}
		else {
			pos = this.lift.undergroundEntrance;
			pos.dim = this.garage.basic.startDim + Math.abs(floor) - 1;
		}
		return pos;
	}

	tryToEnter(player, entranceId) {
		if (entranceId === this.mainEnter.out.entranceId) {
			return this.showGarageMenu(player);
		}
		else if (this.isExitShapeValid(this.garage.shapesList, entranceId)) { // Exit
			if (!this.isCheckShapeClear(player, this.garage.checkShapesList[0])) return;
			player.tpWithVehicle(this.garage.topExit);
		}
		else if (this.isExitShapeValid(this.lift.shapesList, entranceId)) {
			return this.showLiftMenu(player);
		}
	}

	enterGarage(player, floor) {
		const d = this.getGarageEnterPos(floor);
		if (!this.isCheckShapeClear(player, d.checkShape)) return;
		player.tpWithVehicle(d);
	}

	enterLift(player, floor) {
		const d = this.getLiftEnterPos(floor);
		player.tp(d);
	}

	showGarageMenu(player) {
		if (!player.isDriver()) return;
		let execute = `app.id = ${this.id};`;
		execute += `app.title = '${this.garage.basic.outBlipName}';`;
		execute += `app.css = '${this.garage.basic.outBlipName.replace(/\s+/g, '')}.css';`;
		player.call("cGarage-ShowVisitorsGarageMenu", [player.lang, execute, JSON.stringify(this.garage.basic.camData)]);
	}

	showLiftMenu(player) {
		if (player.isDriver()) return;
		let execute = `app.id = ${this.id};`;
		execute += `app.title = '${this.garage.basic.outBlipName}';`;
		execute += `app.css = '../Garage/${this.garage.basic.outBlipName.replace(/\s+/g, '')}.css';`;
		player.call("cGarage-ShowVisitorsLiftMenu", [player.lang, execute]);
	}

}
module.exports = sGarage;


mp.events.add({
	"sGarage-EnterVisitorsGarage" : (player, id, floor) => {
		const g = sBuilding.getBuilding(id);
		g.enterGarage(player, floor);
	},

	"sGarage-EnterFloorByVisitorsLift" : (player, id, floor) => {
		const g = sBuilding.getBuilding(id);
		g.enterLift(player, floor);
	},
});