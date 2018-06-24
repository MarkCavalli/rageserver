"use strict"

const misc = require('../sMisc');


class faction {
	constructor() {
		this.rankNumber = 10;
		this.onlinePlayersList = [];
	}

	addPlayerToList(player) {
		this.onlinePlayersList.push(player);
	}

	removePlayerFromList(name) {
		for (let j = 0; j < mp.players.length; j++) {
			const player = mp.players.at(j);
			if (player.name === name) {
				this.onlinePlayersList.splice(i, 1);
				break;
			}
		}
	}

	invite(player) {
		this.addPlayerToList(player);
	}

	uninvite(player) {
		this.removePlayerFromList(player.name);
		player.nofity("You are a civilian now!");
	}

	addRank(player) {
		if (rank === this.rankNumber || !player.factionInfo) return;
		player.factionInfo.rank++;
		player.nofity("Rank + 1");
	}

	removeRank(player) {
		if (rank === 0) {
			return this.uninvite(player);
		}
	}

	setRank(player, rank) {
		if (!player.factionInfo || !misc.isValueNumber(rank)) return;
		player.factionInfo.rank = rank;
		player.nofity(`Rank: ${rank}`);
	}

}
module.exports = faction;


function insertNewUser() {
	misc.query(`INSERT INTO faction (rank) VALUES ('0')`);
}
module.exports.insertNewUser = insertNewUser;
