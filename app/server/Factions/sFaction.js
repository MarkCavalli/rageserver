"use strict"

const misc = require('../sMisc');
const clothes = require('../Character/sClothes');
const i18n = require('../sI18n');


class faction {
	constructor(factionName) {
		this.name = factionName;
		this.maxRank = 10;
	}

	createEvents() {
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

		mp.events.add({
			"playerEnterColshape" : (player, shape) => {
				if (!player.loggedIn || !this.isInThisFaction(player) || shape !== this.clothingShape) return;
				player.faction.canChangeClothes = true;
				player.notify(`${i18n.get('basic', 'pressE', player.lang)} ${i18n.get('sFaction', 'changeClothes', player.lang)}`);
			},
		
			"playerExitColshape" : (player, shape) => {
				if (!player.loggedIn || !this.isInThisFaction(player) || shape !== this.clothingShape) return;
					player.faction.canChangeClothes = false;
			},
		
			"sKeys-E" : (player) => {
				if (!player.loggedIn || !this.isInThisFaction(player) || !player.faction.canChangeClothes) return;
				this.changeClothes(player);
			},
		});
	}

	createClothingShape(pos) {
		this.clothingShape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1);
		this.clothingMarker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75, 
		{
			color: [255, 255, 0, 15],
			visible: false,
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
		misc.query(`UPDATE faction SET name = '${name}', rank = '${rank}', info = '${JSON.stringify(info)}' WHERE id = '${player.basic.id}'`);
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
		player1.notify(`~r~${player2.name} ${i18n.get('basic', 'tooFarAway', player1.lang)}!`);
		if (showMessToPlayer2) player2.notify(`~r~${player1.name} ${i18n.get('basic', 'tooFarAway', player2.lang)}!`);
		return false;
	}

	isWorking(player) {
		if (player.faction.working) return true;
		return false;
	}

	setWorking(player, status) {
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
		leader.outputChatBox(`!{0, 225, 0}${i18n.get('sFaction', 'setNewRank', leader.lang)} ${player.name}: ${value}`);
		player.outputChatBox(`!{0, 225, 0}${leader.name} ${i18n.get('sFaction', 'changedYourRank', player.lang)} ${value}`);
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
		player.outputChatBox(`!{0, 225, 0}${leader.name} ${i18n.get('sFaction', 'invited', player.lang)} ${this.name}`);
		leader.notify(`~g~${i18n.get('basic', 'success', leader.lang)}!`);
		this.updateClothingMarker(player);
		misc.log.debug(`${leader.name} invited ${player.name} to ${this.name}`);
	}

	setAsLeader(admin, id) {
		if (misc.getAdminLvl(admin) < 1) return;
		const player = mp.players.at(id);
		if (!player) return;
		player.faction = {
			name: this.name,
			rank: 10,
			info: false,
		}
		this.savePlayerData(player);
		player.outputChatBox(`!{0, 225, 0}${i18n.get('sFaction', 'leader', player.lang)} ${this.name}`);
		this.updateClothingMarker(player);
		admin.notify(`~g~${i18n.get('basic', 'success', admin.lang)}!`);
		misc.log.debug(`${admin.name} sets ${player.name} as a ${this.name} leader`);
	}

	uninvite(leader, id) {
		if (!misc.isValueNumber(id) || !this.isInThisFaction(leader) || this.getRank(leader) < 9) return;
		const player = mp.players.at(id);
		if (!player || !this.isInThisFaction(player)) return;
		player.faction = {
			name: false,
		};
		this.savePlayerData(player);
		misc.query(`UPDATE faction SET name = NULL WHERE id = '${player.basic.id}'`);
		player.outputChatBox(`!{225, 0, 0}${leader.name} ${i18n.get('sFaction', 'uninvited', player.lang)} ${this.name}`);
		leader.notify(`~g~${i18n.get('basic', 'success', leader.lang)}!`);
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
			player.notify(`${i18n.get('basic', 'wait', player.lang)} ${60 - time} ${i18n.get('basic', 'seconds', player.lang)}`);
			return false;
		}
		this.updateLastOfferTime(player);

		player.faction.currentClient = client.id;
		client.faction.currentSeller = player.id;
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
		const clientSellerId = this.getCurrentSeller(client);
		const sellerClientId = this.getCurrentClient(seller);
		if (seller.id === clientSellerId && client.id === sellerClientId) return true;
		return false;
	}


}
module.exports = faction;


async function insertNewUser() {
	await misc.query(`INSERT INTO faction (rank) VALUES ('0')`);
}
module.exports.insertNewUser = insertNewUser;


async function loadPlayerAccount(player) {
	const d = await misc.query(`SELECT * FROM faction WHERE id = '${player.basic.id}' LIMIT 1`);
	player.faction = {
		name: d[0].name,
		rank: d[0].rank,
		info: false,
	}
	if (d[0].info) {
		player.faction.info = JSON.parse(d[0].info);
	}
}
module.exports.loadPlayerAccount = loadPlayerAccount;
