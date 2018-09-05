const misc = require('../sMisc');
const clothesSingleton = require('./sClothes');
const headOverlaySingleton = require('./sHeadOverlay');



class CharCreator {
	constructor() {
		this.dimension = 2;
		
		mp.events.add({
			"sCharCreator-ChangeGender" : async (player, gender) => {
				if (gender === 0) player.model = 1885233650;
				else player.model = -1667301416;
				const q2 = clothesSingleton.loadPlayerClothes(player);
				const q3 = headOverlaySingleton.loadUser(player);
				await Promise.all([q2, q3]);
			},
		
			"sCharCreator-SaveSkinOptions" : (player, strJSON) => {
				misc.query(`UPDATE usersBody SET skindata = '${strJSON}' WHERE id = '${player.guid}'`);
			},
		
			"sCharCreator-SaveFaceOptions" : async (player, strJSON) => {
				let gender = 'w';
				if (player.model === 1885233650) gender = 'm';
				await misc.query(`UPDATE usersBody SET gender = '${gender}', facedata = '${strJSON}' WHERE id = '${player.guid}'`);
				
				const q1 = this.loadPlayerBody(player);
				const q2 = clothesSingleton.loadPlayerClothes(player);
				const q3 = headOverlaySingleton.loadUser(player);
				await Promise.all([q1, q2, q3]);
				const firstSpawn = { 
					x: -164, 
					y: 6426, 
					z: 32, 
					rot: 48, 
					dim: 0, 
				}
				player.tp(firstSpawn);

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

	async createNewUser(id) {
		await misc.query(`INSERT INTO usersBody (id, gender) VALUES ('${id}', NULL);`);
	}

	async loadPlayerBody(player) {
		const d = await misc.query(`SELECT * FROM usersBody WHERE id = '${player.guid}'`);
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

const charCreator = new CharCreator();
module.exports = charCreator;