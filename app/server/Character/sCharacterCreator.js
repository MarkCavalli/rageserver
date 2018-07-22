"use strict"

const misc = require('../sMisc');


class sCharCreator {
	constructor() {
		this.dimension = 2;
		
		mp.events.add({
			"sCharCreator-ChangeGender" : async (player, gender) => {
				if (gender === 0) player.model = 1885233650;
				else player.model = -1667301416;
			},
		
			"sCharCreator-SaveSkinOptions" : (player, strJSON) => {
				misc.query(`UPDATE usersBody SET skindata = '${strJSON}' WHERE id = '${player.basic.id}'`);
			},
		
			"sCharCreator-SaveFaceOptions" : async (player, strJSON) => {
				let gender = 'w';
				if (player.model === 1885233650) gender = 'm';
				await misc.query(`UPDATE usersBody SET gender = '${gender}', facedata = '${strJSON}' WHERE id = '${player.basic.id}'`);
				await this.loadPlayerBody(player);
				player.heading = 48;
				player.position = new mp.Vector3(-164, 6426, 32);
				player.dimension = 0;
			},
		});
	}

	changeDimenstion() {
		this.dimension++
		if (this.dimension === 500)	this.dimension = 2;
	}

	openMenu(player) {
		player.model = 1885233650;
		player.position = new mp.Vector3(402.55, -996.37, -99.01);
		player.heading = 180;
		player.dimension = this.dimension;
		this.changeDimenstion();
		player.call("cCharCreator-OpenMenu");
	}

	async createNewUser() {
		await misc.query(`INSERT INTO usersBody (gender) VALUES (NULL)`);
	}

	async loadPlayerBody(player) {
		const d = await misc.query(`SELECT * FROM usersBody WHERE id = '${player.basic.id}'`);
		if (!d[0].gender) return this.openMenu(player);
		if (d[0].gender === 'm') player.model = 1885233650;
		else if (d[0].gender === 'w') player.model = 2147483647;
		this.setBody(player, d[0].skindata);
		this.setFace(player, d[0].facedata);
	}

	setBody(player, strJSON) {
		if (!misc.isValueString(strJSON)) return misc.log.error(`sCharacterCreator-setBody | str is not a string: ${strJSON}`);
		const skindata = JSON.parse(strJSON);
		player.setHeadBlend(skindata[0], skindata[1], 0, skindata[2], 0, 0, skindata[3], 0, 0);
	}

	setFace(player, strJSON) {
		if (!misc.isValueString(strJSON)) return misc.log.error(`sCharacterCreator-setFace | str is not a string: ${strJSON}`);
		const facedata = JSON.parse(strJSON);
		for (let i = 0; i < 20; i++) {
			player.setFaceFeature(i, facedata[i]);
		}
	}
}

const charCreator = new sCharCreator();


async function createNewUser() {
	await charCreator.createNewUser();
}
module.exports.createNewUser = createNewUser;

async function loadPlayerBody(player) {
	await charCreator.loadPlayerBody(player);
}
module.exports.loadPlayerBody = loadPlayerBody;