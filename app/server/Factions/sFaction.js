"use strict"

const misc = require('../sMisc');
const clothes = require('../Character/sClothes');



class faction {
	constructor(factionName) {
		this.name = factionName;
		this.maxRank = 10;

		mp.events.addCommand({		
			'invite' : async (player, id) => {
				this.invite(player, +id);
			},	

			'setrank' : async (player, full, id, rank) => {
				this.setRank(player, +id, +rank);
			},

			'uninvite' : async (player, id) => {
				this.uninvite(player, +id);
			},	
		});
	}

	createClothingShape(pos) {
		const colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1);
		this.clothingMarker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75, 
		{
			color: [255, 255, 0, 15],
			visible: false,
		});

		mp.events.add({
			"playerEnterColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player) || !this.isInThisFaction(player)) return;
				if (shape === colshape) {
					player.faction.canChangeClothes = true;
					player.notify('Press ~b~E ~s~to change clothes');
				}
			},
		
			"playerExitColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player) || !this.isInThisFaction(player)) return;
				if (shape === colshape) {
					player.faction.canChangeClothes = false;
				}
			},
		
			"sKeys-E" : (player) => {
				if (!misc.isPlayerLoggedIn(player) || !this.isInThisFaction(player)) return;
				if (!player.faction.canChangeClothes) return;
				this.changeClothes(player);
			},
		});
	}

	savePlayerData(player) {
		if (!player) return;
		let name = player.faction.name;
		if (!name) name = false;
		let rank = player.faction.rank;
		if (!rank) rank = 1;
		let info = player.faction.info;
		if (!info) info = false;

		misc.query(`UPDATE faction SET factionName = '${name}', factionRank = '${rank}', factionInfo = '${JSON.stringify(info)}' WHERE id = '${player.info.id}'`);
	}

	updateClothingMarker(player) {
		if (this.isInThisFaction(player)) this.clothingMarker.showFor(player);
		else this.clothingMarker.hideFor(player);
	}

	changeClothes(player) {
		if (this.isWorking(player)) {
			this.setWorking(player, false);
			return clothes.loadPlayerClothes(player);
		}
		this.setWorking(player, true);
		if (player.model === 1885233650) {
			this.changeClothesMan(player); // Dont forget add this method to class
		}
		else {
			this.changeClothesWoman(player);  // Dont forget add this method to class
		}
	}

	isInThisFaction(player) {
		if (!player.faction || player.faction.name !== this.name) {
			return false;
		} 
		return true;
	}

	isInOtherFaction(player) {
		if (player.faction.name && player.faction.name !== this.name) {
			return true;
		} 
		return false;
	}

	isDistanceRight(player1, player2, showMessToPlayer2 = false) {
		const dist = player1.dist(player2.position);
		if (dist && dist < 2) {
			return true;
		}
		player1.notify(`~r~${player2.name} too far away from you!`);
		if (showMessToPlayer2) player2.notify(`~r~${player1.name} too far away from you!`);
		return false;
	}

	isWorking(player) {
		if (player.faction.working) return true;
		return false;
	}

	setWorking(player, status) {
		if (!player) return;
		player.faction.working = status;
	}

	getRank(player) {
		if (!this.isInThisFaction(player)) return;
		return player.faction.rank;
	}

	setRank(leader, id, value) {
		if (!misc.isValueNumber(id) || !misc.isValueNumber(value) || !this.isInThisFaction(leader) || this.getRank(leader) < 9) return;
		const player = mp.players.at(id);
		if (!player || !this.isInThisFaction(player) || !this.isDistanceRight(leader, player)) return;
		player.faction.rank = value;
		this.savePlayerData(player);
		leader.outputChatBox(`!{#60e188}You set ${value} rank to ${player.name}`);
		player.outputChatBox(`!{#60e188}${leader.name} sets your rank to ${value}`);
		misc.log.debug(`${leader.name} sets ${player.name} rank to ${value}`);
	}

	invite(leader, id) {
		if (!misc.isValueNumber(id) || !this.isInThisFaction(leader) || this.getRank(leader) < 9) return;
		const player = mp.players.at(id);
		if (!player || !this.isDistanceRight(leader, player) || this.isInOtherFaction(player)) return;
		player.faction = {
			name: this.name,
			rank: 1,
			info: false,
		}
		this.savePlayerData(player);
		player.outputChatBox(`!{#60e188}Congratulations! Now you're working in ${this.name}`);
		this.updateClothingMarker(player);
		misc.log.debug(`${leader.name} invited ${player.name} to ${this.name}`);
	}

	setAsLeader(admin, id) {
		if (admin.info.adminLvl < 1) return;
		const player = mp.players.at(id);
		if (!player) return;
		player.faction = {
			name: this.name,
			rank: 10,
			info: false,
		}
		this.savePlayerData(player);
		player.outputChatBox(`!{#60e188}Congratulations! Now you're working in ${this.name}`);
		this.updateClothingMarker(player);
		admin.notify(`~g~Done!`);
		misc.log.debug(`${admin.name} sets ${player.name} as a ${this.name} leader`);
	}

	uninvite(leader, id) {
		if (!leader || !misc.isValueNumber(id) || !this.isInThisFaction(leader) || this.getRank(leader) < 9) return;
		const player = mp.players.at(id);
		if (!player || !this.isInThisFaction(player)) return;
		player.faction = {
			name: false,
		};
		this.savePlayerData(player);
		misc.query(`UPDATE faction SET factionName = NULL WHERE id = '${player.info.id}'`);
		player.outputChatBox(`!{#ff6b6d}${leader.name} uninvited you from ${this.name}`);
		this.updateClothingMarker(player);
		clothes.loadPlayerClothes(player);
		misc.log.debug(`${leader.name} uninvited ${player.name} from ${this.name}`);
	}

	updateLastOfferTime(player) {
		player.faction.lastOfferTime = new Date().getTime();
	}

	getLastOfferTime(player) {
		return player.faction.lastOfferTime;
	}

	setCurrentClient(player, client) {
		if (!this.isInThisFaction(player) || !this.isWorking(player)) return false;
		const currentTime = new Date().getTime();
		const lastOfferTime = this.getLastOfferTime(player);
		const time = ((currentTime - lastOfferTime) / 1000).toFixed();

		if (lastOfferTime && time < 60) {
			player.notify(`Wait ${60 - time} seconds`);
			return false;
		}
		
		this.updateLastOfferTime(player);

		player.faction.currentClient = client.name;
		client.faction.currentSeller = player.name;
		return true;
	}

	getCurrentClient(player) {
		return player.faction.currentClient;
	}

	getCurrentSeller(client) {
		return client.faction.currentSeller;
	}

	resetCurrentClient(player) {
		player.faction.currentClient = false;
	}

	resetCurrentSeller(client) {
		client.faction.currentSeller = false;
	}

	isSellerClientRight(seller, client) {
		const clientSellerName = this.getCurrentSeller(client);
		const sellerClientName = this.getCurrentClient(seller);
		if (seller.name === clientSellerName && client.name === sellerClientName) return true;
		return false;
	}


}
module.exports = faction;


function insertNewUser() {
	misc.query(`INSERT INTO faction (factionRank) VALUES ('0')`);
}
module.exports.insertNewUser = insertNewUser;


async function loadPlayerAccount(player) {
	const d = await misc.query(`SELECT * FROM faction WHERE id = '${player.info.id}' LIMIT 1`);
	player.faction = {
		name: d[0].factionName,
		rank: d[0].factionRank,
		info: false,
	}
	if (d[0].faction) {
		player.faction.info = JSON.parse(d[0].faction);
	}
}
module.exports.loadPlayerAccount = loadPlayerAccount;
