"use strict"

const faction = require('./sFaction');
const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');




class hospitalClass extends faction {
    constructor() {
		super();
		this.lowestHealthLimit = 10;
		this.mainOutsideCoord = {x: -498.184, y: -335.741, z: 34.502, rot: 263.72};
		this.mainInsideCoord = {x: 275.446, y: -1361.11, z: 24.5378, rot: 46.77 };
		this.startHealCoord = {x: 266.775, y: -1356.136, z: 24.538, rot: 135.53};
	}

	createMainEntities() {
		const mainBlip = mp.blips.new(153, new mp.Vector3(this.mainOutsideCoord.x, this.mainOutsideCoord.y, this.mainOutsideCoord.z),
		{	
			shortRange: true,
			color: 1,
			name: "Hospital",
		});
		this.mainBlip = mainBlip;

		const mainOutsideColshape = mp.colshapes.newSphere(this.mainOutsideCoord.x, this.mainOutsideCoord.y, this.mainOutsideCoord.z, 1);
		this.mainOutsideColshape = mainOutsideColshape;

		const mainOutsideMarker = mp.markers.new(1, new mp.Vector3(this.mainOutsideCoord.x, this.mainOutsideCoord.y, this.mainOutsideCoord.z - 1), 0.75, 
		{
			color: [255, 0, 0, 15],
		});
		this.mainOutsideMarker = mainOutsideMarker;

		const mainInsideColshape = mp.colshapes.newSphere(this.mainInsideCoord.x, this.mainInsideCoord.y, this.mainInsideCoord.z, 1);
		this.mainInsideColshape = mainInsideColshape;

		const mainInsideMarker = mp.markers.new(1, new mp.Vector3(this.mainInsideCoord.x, this.mainInsideCoord.y, this.mainInsideCoord.z - 1), 0.75, 
		{
			color: [255, 0, 0, 15],
		});
		this.mainInsideMarker = mainInsideMarker;


		const startHealShape = mp.colshapes.newSphere(this.startHealCoord.x, this.startHealCoord.y, this.startHealCoord.z, 1);
		this.startHealShape = startHealShape;

		const startHealMarker = mp.markers.new(1, new mp.Vector3(this.startHealCoord.x, this.startHealCoord.y, this.startHealCoord.z - 1), 0.75, 
		{
			color: [255, 0, 0, 15],
		});
		this.startHealMarker = startHealMarker;
	}



	playerEnteredMainOutsideColshape(player) {
		player.info.canOpen.hospitalMainEnter = true;
		player.notify('Press ~b~E ~s~to Enter Hospital');
	}
	playerPressedKeyOnMainOutsideColshape(player) {
		if (!player.info.canOpen.hospitalMainEnter) return;
		this.tpInsideHospital(player);
	}
	tpInsideHospital(player) {
		player.heading = this.mainInsideCoord.rot;
		player.position = new mp.Vector3(this.mainInsideCoord);
		player.dimension = 0;
	}
	playerExitMainOutsideColshape(player) {
		player.info.canOpen.hospitalMainEnter = false;
	}

	///////////////////////////////////////////////////////

	playerEnteredMainInsideColshape(player) {
		player.info.canOpen.hospitalMainExit = true;
		player.notify('Press ~b~E ~s~to Exit Hospital');
	}
	playerPressedKeyOnMainInsideColshape(player) {
		if (!player.info.canOpen.hospitalMainExit) return;
		if (player.health < 75) {
			player.notify("You need a doctor!");
			return;
		}
		this.tpOutsideHospital(player);
	}
	tpOutsideHospital(player) {
		player.heading = this.mainOutsideCoord.rot;
		player.position = new mp.Vector3(this.mainOutsideCoord);
		player.dimension = 0;
		this.stopHealingProcess(player);
	}
	playerExitMainInsideColshape(player) {
		player.info.canOpen.hospitalMainExit = false;
	}

	///////////////////////////////////////////////////////

	playerEnteredStartHealColshape(player) {
		player.info.canOpen.hospitalStartHealing = true;
		player.notify('Press ~b~E ~s~to Start Healing');
	}
	playerPressedKeyOnStartHealColshape(player) {
		if (!player.info.canOpen.hospitalStartHealing) return;
		this.startHealingProcess(player);
	}
	playerExitStartHealColshape(player) {
		player.info.canOpen.hospitalStartHealing = false;
	}

	///////////////////////////////////////////////////////

	loadPlayerAccount(player) {
		player.call("cHospital-DisableHealthRegeneration");
		if (player.health > this.lowestHealthLimit) return;
		this.playerDeath(player);
	}


	playerDeath(player, reason, killer) {
		this.spawnWith1hp(player);
		player.info.hospital.deathTime = new Date().getTime();
		player.playAnimation('anim@veh@btype@side_ps@base', 'dead_fall_out', 2000000, 2);
	}

	spawnWith1hp(player) {
		player.spawn(new mp.Vector3(player.position));
		player.health = 1;
		player.call("cHospital-DisableHealthRegeneration");
	}

	playerPressedKeyOnDeath(player) {
		if (!player.info.hospital || !player.info.hospital.deathTime) return;
		const timeAfterDeath = (new Date().getTime() - player.info.hospital.deathTime) / 1000; // seconds
		if (timeAfterDeath < 70) {
			player.notify("You cant get up");
			return;
		}
		this.payTransferPenalty(player);
		this.tpInsideHospital(player);
		player.info.hospital.deathTime = false;
	}

	payTransferPenalty(player) {
		const dist = player.dist(this.mainOutsideMarker);
		const pay = misc.roundNum(dist / 2);
		moneyAPI.addPenaltyOffline(player.name, pay, "Transfer to Hospital");
	}

	///////////////////////////////////////////////////////

	startHealingProcess(player) {
		player.info.hospital.healing = true;
		player.info.hospital.healingSpeed = 40;
		player.outputChatBox(`!{green}You started healing process`);
	}

	setHealingSpeed(player, speed) {
		if (!misc.isValueNumber(speed)) return;
		player.info.hospital.healingSpeed = speed;
	}

	addHP(player, hp) {
		if (!player.info.hospital.healing || !misc.isValueNumber(hp)) return;
		if (player.health + hp < 100) {
			player.notify(`~g~+ ${hp}hp`);
			player.health += hp
			return;
		}
		player.health = 100;
		this.stopHealingProcess(player);
	}

	stopHealingProcess(player) {
		player.info.hospital.healing = false;
		player.outputChatBox(`!{green}Your healing process is done`);
	}

	///////////////////////////////////////////////////////

	healEvent() {
		const players = mp.players.toArray();
		for (let player of players) {
			this.healEventForPlayer(player)
		}
	}

	healEventForPlayer(player) {
		if (!player.info.hospital || !player.info.hospital.healing || !misc.isValueNumber(player.info.hospital.healingSpeed)) return;
		const hp = player.info.hospital.healingSpeed;
		this.addHP(player, hp);
	}

	///////////////////////////////////////////////////////

	invite(player) {
		super.invite(player);
		player.factionInfo = {
			name: "Hospital",
			rank: 1,
		}
		misc.query(`UPDATE faction SET factionName = 'Hospital', rank = '1', info = null WHERE id = '${player.info.id}'`);
		player.notify("You are a medic now!");
	}

	uninvite(player) {
		super.uninvite(player);
		player.factionInfo = false;
		misc.query(`UPDATE faction SET factionName = null WHERE id = '${player.info.id}'`);
	}

	isPlayerAMedic(player) {
		if (!player.factionInfo || player.factionInfo.name !== "Hospital") return false;
		return true;
	}

	openInteractionMenu(player) {
		if (!this.isPlayerAMedic(player)) return;
		const nearestPlayer = misc.getNearestPlayerInRange(1);
		if (!nearestPlayer) return;
		player.notify(`Open menu: ${nearestPlayer.name}`);
		// Name
		// add 1 hp
		// Increase speed
	}
}

const hospital = new hospitalClass();
hospital.createMainEntities();


mp.events.add(
{
	"playerEnterColshape" : (player, shape) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		if (shape === hospital.mainOutsideColshape) {
			hospital.playerEnteredMainOutsideColshape(player);
		}
		else if (shape === hospital.mainInsideColshape) {
			hospital.playerEnteredMainInsideColshape(player);
		}
		else if (shape === hospital.startHealShape) {
			hospital.playerEnteredStartHealColshape(player);
		}
	},


	"playerExitColshape" : (player, shape) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		if (shape === hospital.mainOutsideColshape) {
			hospital.playerExitMainOutsideColshape(player);
		}
		else if (shape === hospital.mainInsideColshape) {
			hospital.playerExitMainInsideColshape(player);
		}		
		else if (shape === hospital.startHealShape) {
			hospital.playerExitStartHealColshape(player);
		}
	},


	"sKeys-E" : (player) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		hospital.playerPressedKeyOnMainOutsideColshape(player);
		hospital.playerPressedKeyOnMainInsideColshape(player);
		hospital.playerPressedKeyOnDeath(player);
		hospital.playerPressedKeyOnStartHealColshape(player);
	},

	"playerDeath" : (player, reason, killer) => {
		player.call("cHospital-DisableHealthRegeneration");

		setTimeout(function(){
			hospital.playerDeath(player, reason, killer);
		}, 10000);
	},
	
	"sKeys-F4" : (player) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		hospital.openInteractionMenu(player);
	},


});


function healEvent() {
	hospital.healEvent();
}
module.exports.healEvent = healEvent;

function loadPlayerAccount(player) {
	hospital.loadPlayerAccount(player);
}
module.exports.loadPlayerAccount = loadPlayerAccount;



mp.events.addCommand(
{
	'sethospitalleader' : async (player, id) => {
		if (player.info.adminLvl < 1) return;
		const newLeader = mp.players.at(id);
		if (!newLeader) return;
		hospital.invite(newLeader);
		hospital.setRank(newLeader, 10);
	},	
});