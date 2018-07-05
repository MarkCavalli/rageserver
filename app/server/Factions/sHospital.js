"use strict"

const sFaction = require('./sFaction');
const sBuilding = require('./sBuilding');
const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const vehicleAPI = require('../Basic/sVehicle');


class hospitalBuilding extends sBuilding {
	constructor() {
		super();
	}

	createMainEntrance() {
		const mainEntrance = {
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
		this.mainEntrance = super.createDoubleEntrance(mainEntrance);

		mp.events.add({

			"playerEnterColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				if (shape === this.mainEntrance.out) {
					player.info.canEnter = this.mainEntrance.out;
					player.notify('Press ~b~E ~s~to enter');
				}
				else if (shape === this.mainEntrance.in) {
					player.info.canEnter = this.mainEntrance.in;
					player.notify('Press ~b~E ~s~to exit');
				}
				
			},
			
			"sKeys-E" : (player) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				if (!player.info.canEnter) return;
				if (player.info.canEnter === this.mainEntrance.out) {
					return this.enter(player, mainEntrance.inPos);
				}
				else if (player.info.canEnter === this.mainEntrance.in) {
					if (player.health < 75) {
						player.notify("You need a doctor!");
						return;
					}
					patients.stopHealingProcess(player);
					this.enter(player, mainEntrance.outPos);
					return;
				}
			},
		
		});
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
				if (!misc.isPlayerLoggedIn(player)) return;
				if (shape === startHealShape) {
					player.info.hospital.canStartHeal = true;
					player.notify('Press ~b~E ~s~to Start Healing');
				}
			},
		
			"playerExitColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				if (shape === startHealShape) {
					player.info.hospital.canStartHeal = false;
				}
			},
		
			"sKeys-E" : (player) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				if (!player.info.hospital.canStartHeal) return;
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



class patientsClass {
	constructor() {
		mp.events.add({
			"playerDeath" : (player, reason, killer) => {
				setTimeout(() => {
					this.playerDeath(player, reason, killer);
				}, 10000);
			},
		
			"sKeys-E" : (player) => {
				if (!misc.isPlayerLoggedIn(player)) return;
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
		player.info.hospital.deathTime = new Date().getTime(); //seconds
	}

	resetLastDeathTime(player) {
		player.info.hospital.deathTime = false;
	}

	getLastDeathTime(player) {
		return player.info.hospital.deathTime;
	}

	playerPressedKeyOnDeath(player) {
		const deathTime = this.getLastDeathTime(player);
		if (!misc.isPlayerLoggedIn(player) || !deathTime) return;
		const timeAfterDeath = ((new Date().getTime() - deathTime) / 1000).toFixed();
		if (timeAfterDeath < 60) {
			return player.notify(`Wait ${60 - timeAfterDeath} seconds`);
		}

		const posToDrop = { x: -498.184, y: -335.741, z: 34.502 };
		const dist = player.dist(posToDrop);
		const pay = misc.roundNum(dist / 20);
		moneyAPI.addPenaltyOffline(player.name, pay, "Transfer to Hospital");

		const tp = { x: 275.446, y: -1361.11, z: 24.5378, rot: 46.77, dim: 0, };
		building.enter(player, tp);

		this.resetLastDeathTime(player);
	}

	startHealingProcess(player) {
		player.info.hospital.healing = true;
		player.info.hospital.healingSpeed = 1;
		player.outputChatBox(`!{#60e188}You started healing process`);
	}

	isHealing(player) {
		return player.info.hospital.healing;
	}

	stopHealingProcess(player) {
		if (!player.info.hospital.healing) return;
		player.info.hospital.healing = false;
		player.outputChatBox(`!{#60e188}Your healing process is done`);
	}

	setHealingSpeed(player, speed) {
		if (!misc.isValueNumber(speed)) return;
		player.info.hospital.healingSpeed = speed;
	}

	getHealingSpeed(player) {
		return player.info.hospital.healingSpeed;
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
		player.call("cHospital-DisableHealthRegeneration");
	}

	healEvent() {
		const players = mp.players.toArray();
		for (let player of players) {
			if (!misc.isPlayerLoggedIn(player) || !this.isHealing(player)) continue;
			this.addHP(player);
		}
	}

}


function loadPatientsClass() {
	const patients = new patientsClass();
	return patients;
}
const patients = loadPatientsClass();




class doctorsClass extends sFaction {
	constructor() {
		super("Hospital");

		mp.events.add({
			"sKeys-F4" : (player) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				this.openInteractionMenu(player);
			},
			
			"sHospital-IncreaseHealingSpeed" : (player, id) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				this.tryIncreaseHealingSpeed(player, id);
			},
		
			"sHospital-ConfirmIncreaseHealingEvent" : (player, id) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				this.confirmIncreaseHealingSpeed(player, id);
			},
		
			"sHospital-Heal" : (player, id) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				this.tryHeal(player, id);
			},
		
			"sHospital-RejectDoctorOffer" : (player, id) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				this.rejectDoctorOffer(player, id);
			},
		
			"sHospital-ConfirmHealEvent" : (player, id) => {
				if (!misc.isPlayerLoggedIn(player)) return;
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
		
		const lang = misc.getPlayerLang(player);
		player.call("cHospital-ShowDoctorMenu", [lang, execute]);
	}

	rejectDoctorOffer(patient, id) {
		const doctor = mp.players.at(id);
		if (!doctor || !this.isSellerClientRight(doctor, patient)) return;
		
		patient.notify(`You rejected ${doctor.name}'s offer!`);
		doctor.notify(`${patient.name} rejected your offer!`);

		this.resetCurrentSeller(patient);
		this.resetCurrentClient(doctor);
	}

	tryIncreaseHealingSpeed(doctor, id) {
		const patient = mp.players.at(id);
		if (!this.isInThisFaction(doctor) || !this.isWorking(doctor) || !patient || !this.isDistanceRight(doctor, patient)) return;
		if (!patients.isHealing(patient)) {
			doctor.notify(`~r~${patient.name} isn't healing right now!`);
			patient.notify(`~r~You're not healing right now!`);
			return;
		}
		if (!this.setCurrentClient(doctor, patient)) return;
		//updateLanguage(patient);
		const str1 = `app.whoName = '${doctor.name}';`;
		const str2 = `app.whoId = ${doctor.id};`;
		//const str3 = `app.whoText = '${tryIncreaseHealingSpeedText}';`;
		const str3 = `app.wantText = 'Wants increase healing speed';`;
		const str4 = `app.price = 500;`;
		
		const lang = misc.getPlayerLang(patient);
		const execute = str1 + str2 + str3 + str4;

		patient.call("cMisc-CreateChooseWindow", [lang, execute, "sHospital-ConfirmIncreaseHealingEvent", "sHospital-RejectDoctorOffer"]);
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

		doctor.notify(`~g~${patient.name} confirmed your offer!`);
		patient.notify(`~g~You confirmed ${doctor.name}'s offer!`);

		misc.log.debug(`${patient.name} healed by ${doctor.name}. Price: ${price}`);
	}


	tryHeal(doctor, id) {
		const patient = mp.players.at(id);
		if (!this.isInThisFaction(doctor) || !this.isWorking(doctor) || !patient || !this.isDistanceRight(doctor, patient)) return;
		if (!patients.isHealing(patient)) {
			doctor.notify(`~r~${patient.name} isn't healing right now!`);
			patient.notify(`~r~$You're not healing right now!`);
			return;
		}
		if (!this.setCurrentClient(doctor, patient)) return;
		//updateLanguage(patient);
		const str1 = `app.whoName = '${doctor.name}';`;
		const str2 = `app.whoId = ${doctor.id};`;
		//const str3 = `app.wantText = '${tryHealText}';`;
		const str3 = `app.wantText = 'wants heal';`;
		const str4 = `app.price = 5000;`;
		
		const lang = misc.getPlayerLang(patient);
		const execute = str1 + str2 + str3 + str4;

		patient.call("cMisc-CreateChooseWindow", [lang, execute, "sHospital-ConfirmHealEvent", "sHospital-RejectDoctorOffer"]);
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
		if (player.info.adminLvl < 1) return;
		doctors.setAsLeader(player, +id);
	},	
});



class hospitalGarage extends sBuilding {
	constructor() {
		super();
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
			"playerEnterColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player) || !vehicleAPI.isDriver(player)) return;
				if (shape === this.mainEnter.out) {
					player.info.canEnter = this.mainEnter.out
					player.notify('Press ~b~E ~s~to enter');
				}
			},
			
			"sKeys-E" : (player) => {
				if (!misc.isPlayerLoggedIn(player) || !player.info.canEnter || !vehicleAPI.isDriver(player)) return;
				if (player.info.canEnter === this.mainEnter.out) {
					return this.showEnterMenu(player);
				}
			},

			"sHospital-EnterGarage" : (player, floor) => {
				if (player.info.canEnter !== this.mainEnter.out) return;
				const d = this.getDataForEnterGarage(floor);
				if (!this.isCheckShapeClear(player, d.checkShape)) return;
				this.enterByVeh(player, d);
			},
		
		});

	}

	createGarageExit(dim) {
		const mainEntrance = {
			outPos: { x: 224.327, y: -1002.948, z: -98.984, rot: 180.96, dim: dim },
			outShapeR: 3,
		}
		const exitShape = super.createSingleEntrance(mainEntrance);

		mp.events.add({
			"playerEnterColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player) || !vehicleAPI.isDriver(player)) return;
				if (shape === exitShape.out) {
					player.info.canEnter = exitShape.out;
					player.notify('Press ~b~E ~s~to exit');
				}
			},
			
			"sKeys-E" : (player) => {
				if (!misc.isPlayerLoggedIn(player) || !player.info.canEnter || !vehicleAPI.isDriver(player)) return;
				if (player.info.canEnter === exitShape.out) {
					if (!this.isCheckShapeClear(player, this.mainCheckShape)) return;
					this.exitGarageByVeh(player);
				}
			},
		});
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
				player.notify(`~r~Some vehicle is blocking the area!`);
				return false;
			}
		}
		const players = mp.players.toArray();
		for (let player of players) {
			if (shape.isPointWithin(player.position)  && shape.dimension === player.dimension) {
				player.notify(`~r~Some player is blocking the area!`);
				return false;
			}
		}
		return true;
	}

	showEnterMenu(player) {
		if (!vehicleAPI.isDriver(player)) return;
		const lang = misc.getPlayerLang(player);
		player.call("cHospital-ShowGarageMenu", [lang]);
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
	garage.createCheckShapes();
	return garage;
}

const garage = createGarage();
