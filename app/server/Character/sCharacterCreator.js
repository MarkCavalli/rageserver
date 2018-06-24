"use strict"

const misc = require('../sMisc');
let dimnumber = 2;

async function insertNewUser() {
	let obj = {		number: 0,	color: 0,	};
	obj = JSON.stringify(obj);
	let tops = {	number: 0,	color: 0,	underColor: 0,	};
	tops = JSON.stringify(tops);
	
	await misc.query(`INSERT INTO userskins (skin, hats, glasses, tops, legs, feet) VALUES ('0', '${obj}', '${obj}', '${tops}', '${obj}', '${obj}')`);
}
module.exports.insertNewUser = insertNewUser;


async function loadPlayerAppearance(player) {
	const data = await misc.query(`SELECT skin, skindata, facedata FROM userskins WHERE id = '${player.info.id}'`);
	if (data[0].skin === 0) {
		return start(player);
	}
	player.model = data[0].skin;
	setSkinData(player, data[0].skindata);
	setFaceData(player, data[0].facedata);
}
module.exports.loadPlayerAppearance = loadPlayerAppearance;



function start(player) {
	player.model = 1885233650;
	player.position = new mp.Vector3(402.55, -996.37, -99.01);
	player.heading = 180;
	player.dimension = dimnumber;
	dimnumber++;
	if (dimnumber === 500)	{
		dimnumber = 2;
	}
	player.call("cCharCreatorStart");
}

function setSkinData(player, strJSON) {
	if (!misc.isValueString(strJSON)) return misc.log.error(`setSkinData | str is not a string: ${strJSON}`);;
	const skindata = JSON.parse(strJSON);
	player.setHeadBlend(skindata[0], skindata[1], 0, skindata[2], 0, 0, skindata[3], 0, 0);
}

function setFaceData(player, strJSON) {
	if (!misc.isValueString(strJSON)) return misc.log.error(`setFaceData | str is not a string: ${strJSON}`);;
	const skindata = JSON.parse(strJSON);
	for (let i = 0; i < 20; i++) {
		player.setFaceFeature(i, skindata[i]);
	}
}


mp.events.add(
{
	"sCharCreatorChangeGender" : async (player, gender) => {
		if (gender === 0) player.model = 1885233650;
		else player.model = -1667301416;
	},

	"sCharCreatorSaveSkinOptions" : (player, strJSON) => {
		misc.query(`UPDATE userskins SET skindata = '${strJSON}' WHERE id = '${player.info.id}'`);
	},

	"sCharCreatorUpdateFaceOptions" : (player, strJSON) => {
		setFaceData(player, strJSON);
	},

	"sCharCreatorSaveFaceOptions" : async (player, strJSON) => {
		await misc.query(`UPDATE userskins SET facedata = '${strJSON}', skin = '${player.model}' WHERE id = '${player.info.id}'`);
		await loadPlayerAppearance(player);
		player.heading = 48;
		player.position = new mp.Vector3(-164, 6426, 32);
		player.dimension = 0;
	},
});
