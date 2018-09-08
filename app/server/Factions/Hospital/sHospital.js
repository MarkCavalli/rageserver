const misc = require('../../sMisc');
const sFaction = require('../sFaction');
const hospitalBuilding = require('./sHospitalBuilding');
const hospitalVisitorsGarage = require('./sHospitalVisitorsGarage');
const i18n = require('../../sI18n');




class Hospital extends sFaction {
	constructor() {
		super("Hospital");

		mp.events.add({
			"playerDeath" : (player, reason, killer) => {
				player.call("cMisc-CallServerEvenWithTimeout", ["sHospital-SpawnAfterDeath", 10000]);
				let killername;
				if (killer) killername = killer.name;
				misc.log.debug(`${player.name} death! Reason: ${reason}, killer: ${killername}`);
			},

			"sHospital-SpawnAfterDeath" : (player) => {
				this.spawnAfterDeath(player);
			},

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

		const pos = {x: 268.457, y: -1365.145, z: 24.538, rot: 144.58};
		this.createClothingShape(pos);
		this.createEvents();
	}

	spawnAfterDeath(player) {
		if (!player.loggedIn) return;
		player.spawn(new mp.Vector3(player.position));
		player.health = 1;
		player.call("cHospital-DisableHealthRegeneration");
		player.healingSpeed = 0;
		const posToDrop = { x: -498.184, y: -335.741, z: 34.502 };
		const dist = player.dist(posToDrop);
		const pay = misc.roundNum(dist / 20);
		player.newFine(pay, `${i18n.get('sHospital', 'transferTo', player.lang)}`);

		const tp = { x: 275.446, y: -1361.11, z: 24.5378, rot: 46.77, dim: 0 };
		player.tp(tp);
		misc.log.debug(`${player.name} transfered to Hospital. Fine: $${pay}`);
	}

	changeClothesMan(player) {
		player.setClothes(11, 12, 0, 0); // Tops
		player.setClothes(3, 12, 0, 0); // Tops
		player.setClothes(8, 12, 0, 0); // Tops

		player.setClothes(4, 20, 0, 0); // Legs
	}

	changeClothesWoman(player) {
		player.setClothes(11, 27, 0, 0); // Tops
		player.setClothes(3, 0, 0, 0); // Tops
		player.setClothes(8, 2, 0, 0); // Tops

		player.setClothes(4, 23, 0, 0); // Legs
	}

	openInteractionMenu(player) {
		if (!this.isInThisFaction(player) || !this.isWorking(player)) return;
		const nearestPlayer = misc.getNearestPlayerInRange(player.position, 1);
		if (!nearestPlayer) return;
		let execute = `app.patientId = ${nearestPlayer.id};`;
		execute += `app.patientName = '${nearestPlayer.name}';`;	
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

	confirmIncreaseHealingSpeed(patient, id) {
		const doctor = mp.players.at(id);
		if (!doctor || !this.isSellerClientRight(doctor, patient) || !patient.healingSpeed || !this.isDistanceRight(doctor, patient, true)) return;
		this.successConfirmEvent(doctor, patient, 500, 5);
	}

	tryIncreaseHealingSpeed(doctor, id) {
		const patient = mp.players.at(id);
		if (!this.isInThisFaction(doctor) || !this.isWorking(doctor) || !patient || !this.isDistanceRight(doctor, patient)) return;
		if (!patient.healingSpeed) {
			doctor.notify(`~r~${patient.name} ${i18n.get('sHospital', 'isntHealing', doctor.lang)}!`);
			patient.notify(`~r~${i18n.get('sHospital', 'youArentHealing', patient.lang)}!`);
			return;
		}
		if (!this.setCurrentClient(doctor, patient)) return;
		let execute = `app.whoName = '${doctor.name}';`;
		execute += `app.whoId = ${doctor.id};`;
		execute += `app.wantText = '${i18n.get('sHospital', 'wantsIncreaseHealing', patient.lang)}';`;
		execute += `app.price = 500;`;
		patient.call("cMisc-CreateChooseWindow", [patient.lang, execute, "sHospital-ConfirmIncreaseHealingEvent", "sHospital-RejectDoctorOffer"]);
	}

	async successConfirmEvent(doctor, patient, price, healSpeed) {
		const canBuy = await patient.changeMoney(-price);
		if (!canBuy) return;
		patient.healingSpeed = healSpeed;
		doctor.changeMoney(price);
		this.resetCurrentSeller(patient);
		this.resetCurrentClient(doctor);
		doctor.notify(`~g~${patient.name} ${i18n.get('basic', 'confirmedYourOffer', doctor.lang)}!`);
		patient.notify(`~g~${i18n.get('basic', 'youConfirmedOffer', patient.lang)} ${doctor.name}!`);
		misc.log.debug(`${patient.name} healed by ${doctor.name}. Price: ${price}`);
	}

	tryHeal(doctor, id) {
		const patient = mp.players.at(id);
		if (!this.isInThisFaction(doctor) || !this.isWorking(doctor) || !patient || !this.isDistanceRight(doctor, patient)) return;
		if (!patient.healingSpeed) {
			doctor.notify(`~r~${patient.name} ${i18n.get('sHospital', 'isntHealing', doctor.lang)}!`);
			patient.notify(`~r~${i18n.get('sHospital', 'youArentHealing', patient.lang)}!`);
			return;
		}
		if (!this.setCurrentClient(doctor, patient)) return;
		let execute = `app.whoName = '${doctor.name}';`;
		execute += `app.whoId = ${doctor.id};`;
		execute += `app.wantText = '${i18n.get('sHospital', 'wantsHeal', patient.lang)}';`;
		execute += `app.price = 5000;`;
		patient.call("cMisc-CreateChooseWindow", [patient.lang, execute, "sHospital-ConfirmHealEvent", "sHospital-RejectDoctorOffer"]);
	}

	confirmHeal(patient, id) {
		const doctor = mp.players.at(id);
		if (!doctor || !this.isSellerClientRight(doctor, patient) || !patient.healingSpeed || !this.isDistanceRight(doctor, patient, true)) return;
		this.successConfirmEvent(doctor, patient, 5000, 100);
	}

}
const hospital = new Hospital();





function loadUser(player) {
	player.call("cHospital-DisableHealthRegeneration");
	player.healingSpeed = 0;
	player.canStartHeal = false;

	player.stopHealing = function() {
		if (this.healingSpeed === 0) return;
		this.healingSpeed = 0;
		this.outputChatBox(`!{0, 200, 0}${i18n.get('sHospital', 'finishedHealing', this.lang)}!`);
		misc.log.debug(`${this.name} finished healing. HP: ${this.health}`);
	}
	
	player.startHealing = function() {
		if (this.healingSpeed > 0) return;
		this.healingSpeed = 25;
		player.outputChatBox(`!{0, 200, 0}${i18n.get('sHospital', 'startedHealing', this.lang)}!`);
		misc.log.debug(`${this.name} start healing. HP: ${this.health}`);
	}

	player.addHP = function() {
		if (this.healingSpeed === 0) return;
		this.health += this.healingSpeed;
		this.notify(`~g~+ ${this.healingSpeed}hp`);
		misc.log.debug(`${this.name} got ${this.healingSpeed}hp. Total: ${this.health}`);
		if (this.health <= 100) return;
		this.health = 100;
		this.stopHealing();
	}
}
module.exports.loadUser = loadUser;



mp.events.addCommand({
	'sethospitalleader' : async (player, id) => {
		if (misc.getAdminLvl(player) < 1) return;
		hospital.setAsLeader(player, +id);
	},	
});