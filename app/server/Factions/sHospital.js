"use strict"

const sFaction = require('./sFaction');
const sBuilding = require('./sBuilding');
const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const vehicleAPI = require('../Basic/sVehicle');
const i18n = require('../sI18n');



class hospitalBuilding extends sBuilding {
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
			return this.enter(player, this.mainEntranceData.inPos);
		}
		else if (entranceId === this.mainEntrance.in.entranceId) {
			if (player.vehicle) return;
			if (player.health < 75) {
				player.notify(`~r~${i18n.get('sHospital', 'needHelp', player.lang)}`);
				return;
			}
			patients.stopHealingProcess(player);
			this.enter(player, this.mainEntranceData.outPos);
		}
	}

	createHealingShape() {
		const startHealCoord = {x: 266.775, y: -1356.136, z: 24.538, rot: 135.53};
		const startHealShape = mp.colshapes.newSphere(startHealCoord.x, startHealCoord.y, startHealCoord.z, 1);
		mp.markers.new(1, new mp.Vector3(startHealCoord.x, startHealCoord.y, startHealCoord.z - 1), 0.75, 
		{
			color: [255, 0, 0, 15],
		});

		mp.events.add(
		{
			"playerEnterColshape" : (player, shape) => {
				if (!player.loggedIn || shape !== startHealShape) return;
				player.hospital.canStartHeal = true;
				player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('sHospital', 'toStartHealing', player.lang)}`);
			},
		
			"playerExitColshape" : (player, shape) => {
				if (!player.loggedIn || shape !== startHealShape) return;
					player.hospital.canStartHeal = false;
			},
		
			"sKeys-E" : (player) => {
				if (!player.loggedIn || !player.hospital.canStartHeal) return;
				patients.startHealingProcess(player);
			},
		
		});

	}



}
function loadBuildingClass() {
	const building = new hospitalBuilding();
	building.createMainEntrance();
	building.createHealingShape();
	return building;
}
const building = loadBuildingClass();



class hospitalGarage extends sBuilding {
	constructor() {
		super();
		this.garageExitShapesList = [];
		this.liftExitShapesList = [];
	}

	createMainEntrance() {
		const mainEntrance = {
			outPos: { x: -515.651, y: -295.108, z: 34.795, rot: 201.06, dim: 0 },
			outBlipId: 50,
			outBlipCol: 1,
			outBlipName: "Hospital Garage",
			outBlipScale: 0.7,
			outShapeR: 3,
		}
		this.mainEnter = super.createSingleEntrance(mainEntrance);

		
		mp.events.add({
			"sHospital-EnterGarage" : (player, floor) => {
				const d = this.getDataForEnterGarage(floor);
				if (!this.isCheckShapeClear(player, d.checkShape)) return;
				this.enterByVeh(player, d);
			},

			"sHospital-EnterFloorByLift" : (player, floor) => {
				const d = this.getDataForEnterLift(floor);
				this.enter(player, d);
			},
		
		});

	}

	enteredBuildingShape(player, entranceId) {
		if (entranceId === this.mainEnter.out.entranceId) {
			if (!vehicleAPI.isDriver(player)) return;
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toEnterGarage', player.lang)}`);
		}
		else if (this.isGarageExitShapeValid(entranceId)) {
			if (!vehicleAPI.isDriver(player)) return;
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toExitGarage', player.lang)}`);
		}
		else if (this.isLiftExitShapeValid(entranceId)) {
			player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('basic', 'toCallLift', player.lang)}`);
		}
	}

	tryToEnter(player, entranceId) {
		if (entranceId === this.mainEnter.out.entranceId) {
			return this.showEnterMenu(player);
		}
		else if (this.isGarageExitShapeValid(entranceId)) {
			if (!this.isCheckShapeClear(player, this.mainCheckShape)) return;
			this.exitGarageByVeh(player);
		}
		else if (this.isLiftExitShapeValid(entranceId)) {
			return player.call("cHospital-ShowLiftMenu", [player.lang]);
		}
	}

	createGarageExit(dim) {
		const mainEntrance = {
			outPos: { x: 224.327, y: -1002.948, z: -98.984, rot: 180.96, dim: dim },
			outShapeR: 3,
		}
		const exitShape = super.createSingleEntrance(mainEntrance);
		this.garageExitShapesList.push(exitShape);
	}

	createLiftExit(d, dim) {
		const mainEntrance = {
			outPos: { x: d.x, y: d.y, z: d.z, rot: d.rot, dim: dim },
			outShapeR: 1,
		}
		const exitShape = super.createSingleEntrance(mainEntrance);
		this.liftExitShapesList.push(exitShape);
	}

	isGarageExitShapeValid(id) {
		for (let i = 0; i < this.garageExitShapesList.length; i++) {
			if (this.garageExitShapesList[i].out.entranceId === id) {
				return this.garageExitShapesList[i];
			}
		}
		return false;
	}

	isLiftExitShapeValid(id) {
		for (let i = 0; i < this.liftExitShapesList.length; i++) {
			if (this.liftExitShapesList[i].out.entranceId === id) {
				return this.liftExitShapesList[i];
			}
		}
		return false;
	}

	createCheckShapes() {
		this.mainCheckShape = mp.colshapes.newSphere(-460.698, -272.399, 35.347, 3);
		this.mainCheckShape.dimension = 0;

		this.checkFloor1Shape = mp.colshapes.newSphere(231.896, -1003.318, -98.985, 3);
		this.checkFloor1Shape.dimension = 1;
		this.checkFloor2Shape = mp.colshapes.newSphere(231.896, -1003.318, -98.985, 3);
		this.checkFloor2Shape.dimension = 2;
		this.checkFloor3Shape = mp.colshapes.newSphere(231.896, -1003.318, -98.985, 3);
		this.checkFloor3Shape.dimension = 3;
		this.checkFloor4Shape = mp.colshapes.newSphere(231.896, -1003.318, -98.985, 3);
		this.checkFloor4Shape.dimension = 4;
		this.checkFloor5Shape = mp.colshapes.newSphere(231.896, -1003.318, -98.985, 3);
		this.checkFloor5Shape.dimension = 5;
	}

	isCheckShapeClear(player, shape) {
		const vehicles = mp.vehicles.toArray();
		for (let vehicle of vehicles) {
			if (shape.isPointWithin(vehicle.position) && shape.dimension === vehicle.dimension) {
				player.notify(`~r~${i18n.get('basic', 'someVehicleIsBlocking', player.lang)}!`);
				return false;
			}
		}
		const players = mp.players.toArray();
		for (let player of players) {
			if (shape.isPointWithin(player.position)  && shape.dimension === player.dimension) {
				player.notify(`~r~${i18n.get('basic', 'somePlayerIsBlocking', player.lang)}!`);
				return false;
			}
		}
		return true;
	}

	showEnterMenu(player) {
		if (!vehicleAPI.isDriver(player)) return;
		player.call("cHospital-ShowGarageMenu", [player.lang]);
	}

	getDataForEnterGarage(floor) {
		if (!misc.isValueNumber(floor)) return;
		const floors = [
			{ floor: -1, x: 231.896, y: -1003.318, z: -98.985, rot: 358.73, dim: 1, checkShape: this.checkFloor1Shape },
			{ floor: -2, x: 231.896, y: -1003.318, z: -98.985, rot: 358.73, dim: 2, checkShape: this.checkFloor2Shape },
			{ floor: -3, x: 231.896, y: -1003.318, z: -98.985, rot: 358.73, dim: 3, checkShape: this.checkFloor3Shape },
			{ floor: -4, x: 231.896, y: -1003.318, z: -98.985, rot: 358.73, dim: 4, checkShape: this.checkFloor4Shape },
			{ floor: -5, x: 231.896, y: -1003.318, z: -98.985, rot: 358.73, dim: 5, checkShape: this.checkFloor5Shape },
		];
		for (let d of floors) {
			if (d.floor === floor) return d;
		}
		return false;
	}

	getDataForEnterLift(floor) {
		if (!misc.isValueNumber(floor)) return;
		const floors = [
			{ floor:  0, x: 246.519, y: -1372.557, z: 24.50, rot: 316, dim: 0 },
			{ floor: -1, x: 241.378, y: -1004.781, z: -99, rot: 88.36, dim: 1 },
			{ floor: -2, x: 241.378, y: -1004.781, z: -99, rot: 88.36, dim: 2 },
			{ floor: -3, x: 241.378, y: -1004.781, z: -99, rot: 88.36, dim: 3 },
			{ floor: -4, x: 241.378, y: -1004.781, z: -99, rot: 88.36, dim: 4 },
			{ floor: -5, x: 241.378, y: -1004.781, z: -99, rot: 88.36, dim: 5 },
		];
		for (let d of floors) {
			if (d.floor === floor) return d;
		}
		return false;
	}

	exitGarageByVeh(player) {
		const d = { x: -460.698, y: -272.399, z: 35.347, rot: 23.34, dim: 0 };
		this.enterByVeh(player, d);
	}

}
function createGarage() {
	const garage = new hospitalGarage();
	garage.createMainEntrance();
	garage.createGarageExit(1);
	garage.createGarageExit(2);
	garage.createGarageExit(3);
	garage.createGarageExit(4);
	garage.createGarageExit(5);
	const hospitalLift = {x: 246.519, y: -1372.557, z: 24.50, rot: 316 };
	const garageLift = {x: 241.378, y: -1004.781, z: -99, rot: 88.36 };
	garage.createLiftExit(hospitalLift, 0);
	garage.createLiftExit(garageLift, 1);
	garage.createLiftExit(garageLift, 2);
	garage.createLiftExit(garageLift, 3);
	garage.createLiftExit(garageLift, 4);
	garage.createLiftExit(garageLift, 5);
	
	garage.createCheckShapes();
	return garage;
}
const garage = createGarage();



class patientsClass {
	constructor() {
		mp.events.add({
			"playerDeath" : (player, reason, killer) => {
				setTimeout(() => {
					this.playerDeath(player, reason, killer);
				}, 10000);
				misc.log.debug(`${player.name} death! Reason: ${reason}, killer: ${killer.name}`);
			},
		
			"sKeys-E" : (player) => {
				if (!player.loggedIn) return;
				this.playerPressedKeyOnDeath(player);
			},
		});
	}

	playerDeath(player, reason, killer) {
		this.stopHealingProcess(player);
		player.spawn(new mp.Vector3(player.position));
		player.health = 1;
		player.call("cHospital-DisableHealthRegeneration");
		this.setLastDeathTime(player);
		player.playAnimation('anim@veh@btype@side_ps@base', 'dead_fall_out', 2000000, 2);
	}

	setLastDeathTime(player) {
		player.hospital.deathTime = new Date().getTime(); //seconds
	}

	resetLastDeathTime(player) {
		player.hospital.deathTime = false;
	}

	getLastDeathTime(player) {
		return player.hospital.deathTime;
	}

	playerPressedKeyOnDeath(player) {
		const deathTime = this.getLastDeathTime(player);
		if (!player.loggedIn || !deathTime) return;
		const timeAfterDeath = ((new Date().getTime() - deathTime) / 1000).toFixed();
		if (timeAfterDeath < 60) {
			return player.notify(`${i18n.get('basic', 'wait', player.lang)} ${60 - timeAfterDeath} ${i18n.get('basic', 'seconds', player.lang)}`);
		}

		const posToDrop = { x: -498.184, y: -335.741, z: 34.502 };
		const dist = player.dist(posToDrop);
		const pay = misc.roundNum(dist / 20);
		moneyAPI.newFine(player.basic.id, pay, `${i18n.get('sHospital', 'transferTo', player.lang)}`);

		const tp = { x: 275.446, y: -1361.11, z: 24.5378, rot: 46.77, dim: 0, };
		building.enter(player, tp);

		this.resetLastDeathTime(player);
		misc.log.debug(`${player.name} transfered to Hospital. Fine: $${pay}`);
	}

	startHealingProcess(player) {
		player.hospital.healing = true;
		player.hospital.healingSpeed = 1;
		player.outputChatBox(`!{0, 200, 0}${i18n.get('sHospital', 'startedHealing', player.lang)}!`);
		misc.log.debug(`${player.name} start healing. HP: ${player.health}`);
	}

	isHealing(player) {
		return player.hospital.healing;
	}

	stopHealingProcess(player) {
		if (!this.isHealing(player)) return;
		player.hospital.healing = false;
		player.outputChatBox(`!{0, 200, 0}${i18n.get('sHospital', 'finishedHealing', player.lang)}!`);
		misc.log.debug(`${player.name} finished healing. HP: ${player.health}`);
	}

	setHealingSpeed(player, speed) {
		if (!misc.isValueNumber(speed)) return;
		player.hospital.healingSpeed = speed;
	}

	getHealingSpeed(player) {
		return player.hospital.healingSpeed;
	}

	addHP(player) {
		if (!this.isHealing(player)) return;
		const hp = this.getHealingSpeed(player);
		if (player.health + hp < 100) {
			player.notify(`~g~+ ${hp}hp`);
			player.health += hp;
			return;
		}
		player.health = 100;
		this.stopHealingProcess(player);
	}

	loadPlayerAccount(player) {
		player.hospital = {};
		player.call("cHospital-DisableHealthRegeneration");
	}

	healEvent() {
		const players = mp.players.toArray();
		for (let player of players) {
			if (!player.loggedIn || !this.isHealing(player)) continue;
			this.addHP(player);
		}
	}

}
const patients = new patientsClass();


class doctorsClass extends sFaction {
	constructor() {
		super("Hospital");

		mp.events.add({
			"sKeys-F4" : (player) => {
				if (!player.loggedIn) return;
				this.openInteractionMenu(player);
			},
			
			"sHospital-IncreaseHealingSpeed" : (player, id) => {
				if (!player.loggedIn) return;
				this.tryIncreaseHealingSpeed(player, id);
			},
		
			"sHospital-ConfirmIncreaseHealingEvent" : (player, id) => {
				if (!player.loggedIn) return;
				this.confirmIncreaseHealingSpeed(player, id);
			},
		
			"sHospital-Heal" : (player, id) => {
				if (!player.loggedIn) return;
				this.tryHeal(player, id);
			},
		
			"sHospital-RejectDoctorOffer" : (player, id) => {
				if (!player.loggedIn) return;
				this.rejectDoctorOffer(player, id);
			},
		
			"sHospital-ConfirmHealEvent" : (player, id) => {
				if (!player.loggedIn) return;
				this.confirmHeal(player, id);
			},
			
		});
	}

	changeClothesMan(player) {
		player.setClothes(11, 12, 0, 0); //Tops
		player.setClothes(3, 12, 0, 0); //Tops
		player.setClothes(8, 12, 0, 0); //Tops

		player.setClothes(4, 20, 0, 0); // Legs
	}

	changeClothesWoman(player) {
		player.setClothes(11, 27, 0, 0); //Tops
		player.setClothes(3, 0, 0, 0); //Tops
		player.setClothes(8, 2, 0, 0); //Tops

		player.setClothes(4, 23, 0, 0); // Legs
	}

	openInteractionMenu(player) {
		if (!this.isInThisFaction(player) || !this.isWorking(player)) return;
		const nearestPlayer = misc.getNearestPlayerInRange(player, 1);
		if (!nearestPlayer) return;
		const str1 = `app.patientId = ${nearestPlayer.id};`;
		const str2 = `app.patientName = '${nearestPlayer.name}';`;
	
		const execute = str1 + str2;
		
		player.call("cHospital-ShowDoctorMenu", [player.lang, execute]);
	}

	rejectDoctorOffer(patient, id) {
		const doctor = mp.players.at(id);
		if (!doctor || !this.isSellerClientRight(doctor, patient)) return;
		patient.notify(`${i18n.get('basic', 'youRejectedOffer', patient.lang)} ${doctor.name}!`);
		doctor.notify(`${patient.name} ${i18n.get('basic', 'rejectedYourOffer', doctor.lang)}!`);

		this.resetCurrentSeller(patient);
		this.resetCurrentClient(doctor);
	}

	tryIncreaseHealingSpeed(doctor, id) {
		const patient = mp.players.at(id);
		if (!this.isInThisFaction(doctor) || !this.isWorking(doctor) || !patient || !this.isDistanceRight(doctor, patient)) return;
		if (!patients.isHealing(patient)) {
			doctor.notify(`~r~${patient.name} ${i18n.get('sHospital', 'isntHealing', doctor.lang)}!`);
			patient.notify(`~r~${i18n.get('sHospital', 'youArentHealing', patient.lang)}!`);
			return;
		}
		if (!this.setCurrentClient(doctor, patient)) return;
		const str1 = `app.whoName = '${doctor.name}';`;
		const str2 = `app.whoId = ${doctor.id};`;
		const str3 = `app.wantText = '${i18n.get('sHospital', 'wantsIncreaseHealing', patient.lang)}';`;
		const str4 = `app.price = 500;`;
		
		const execute = str1 + str2 + str3 + str4;

		patient.call("cMisc-CreateChooseWindow", [patient.lang, execute, "sHospital-ConfirmIncreaseHealingEvent", "sHospital-RejectDoctorOffer"]);
	}

	confirmIncreaseHealingSpeed(patient, id) {
		const doctor = mp.players.at(id);
		if (!doctor || !this.isSellerClientRight(doctor, patient) || !patients.isHealing(patient) || !this.isDistanceRight(doctor, patient, true)) return;
		this.successConfirmEvent(doctor, patient, 500, 5);
	}
	
	async successConfirmEvent(doctor, patient, price, healSpeed) {
		const canBuy = await moneyAPI.changeMoney(patient, -price);
		if (!canBuy) return;

		patients.setHealingSpeed(patient, healSpeed);

		moneyAPI.changeMoney(doctor, price);

		this.resetCurrentSeller(patient);
		this.resetCurrentClient(doctor);

		doctor.notify(`~g~${patient.name} ${i18n.get('basic', 'confirmedYourOffer', doctor.lang)}!`);
		patient.notify(`~g~${i18n.get('basic', 'youConfirmedOffer', patient.lang)} ${doctor.name}!`);

		misc.log.debug(`${patient.name} healed by ${doctor.name}. Price: ${price}`);
	}


	tryHeal(doctor, id) {
		const patient = mp.players.at(id);
		if (!this.isInThisFaction(doctor) || !this.isWorking(doctor) || !patient || !this.isDistanceRight(doctor, patient)) return;
		if (!patients.isHealing(patient)) {
			doctor.notify(`~r~${patient.name} ${i18n.get('sHospital', 'isntHealing', doctor.lang)}!`);
			patient.notify(`~r~${i18n.get('sHospital', 'youArentHealing', patient.lang)}!`);
			return;
		}
		if (!this.setCurrentClient(doctor, patient)) return;
		const str1 = `app.whoName = '${doctor.name}';`;
		const str2 = `app.whoId = ${doctor.id};`;
		const str3 = `app.wantText = '${i18n.get('sHospital', 'wantsHeal', patient.lang)}';`;
		const str4 = `app.price = 5000;`;
		
		const execute = str1 + str2 + str3 + str4;

		patient.call("cMisc-CreateChooseWindow", [patient.lang, execute, "sHospital-ConfirmHealEvent", "sHospital-RejectDoctorOffer"]);
	}
	
	confirmHeal(patient, id) {
		const doctor = mp.players.at(id);
		if (!doctor || !this.isSellerClientRight(doctor, patient) || !patients.isHealing(patient) || !this.isDistanceRight(doctor, patient, true)) return;
		this.successConfirmEvent(doctor, patient, 5000, 100);
	}
}
function loadDoctorsClass() {
	const doctors = new doctorsClass();
	const pos = {x: 268.457, y: -1365.145, z: 24.538, rot: 144.58};
	doctors.createClothingShape(pos);
	doctors.createEvents();
	return doctors;
}
const doctors = loadDoctorsClass();


function healEvent() {
	patients.healEvent();
}
module.exports.healEvent = healEvent;

function loadPlayerAccount(player) {
	patients.loadPlayerAccount(player);
	doctors.updateClothingMarker(player);
}
module.exports.loadPlayerAccount = loadPlayerAccount;



mp.events.addCommand({
	'sethospitalleader' : async (player, id) => {
		if (misc.getAdminLvl(player) < 1) return;
		doctors.setAsLeader(player, +id);
	},	
});
