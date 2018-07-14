"use strict"

const misc = require('../sMisc');
const time = require('./sTime');

let someoneText;
function updateLanguage(player) {
	someoneText = "Someone";

	const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
		someoneText = "Неизвестный";
	}

	else if (lang === "ger") {
		someoneText = "Jemand";
	}
	
	else if (lang === "br") {
		someoneText = "Alguém";
	} 
  
  else if (lang === "zhs") {
		someoneText = "某人";
	} 
  
  else if (lang === "zht") {
		someoneText = "某人";
	}

}



mp.events.add('playerChat', (player, message) => {
	sayRP(player, message);
	misc.log.debug(`${player.name}[${player.id}]: ${message}.`);
});

function sayRP(player, text, anon = false) {
	mp.players.forEachInRange(player.position, 10, (client) => {
		let dist = client.dist(player.position);
		let color = getColorInRange("white", dist);
		const currentTime = time.getTime();

		updateLanguage(client);

		if (anon) {
			client.outputChatBox(`!{${color}}[${currentTime}] ${someoneText}: ${text}`);
		}
		else {
			client.outputChatBox(`!{${color}}[${currentTime}] ${player.name}[${player.id}]: ${text}`);
		}
	});
}
module.exports.sayRP = sayRP;

function getColorInRange(type, dist) {
	let color;
	switch (type) {
		case "white":
			if (0 <= dist && dist < 2) {
				color = "white";
			}
			else if (2 <= dist && dist < 4) {
				color = "#CECECE";
			}
			else if (4 <= dist && dist < 6) {
				color = "#AFAFAF";
			}
			else if (6 <= dist && dist < 8) {
				color = "#919191";
			}
			else if (8 <= dist && dist < 10) {
				color = "#727272";
			}
			break;
		case "purple":
			if (0 <= dist && dist < 2) {
				color = "#C2A2DA";
			}
			else if (2 <= dist && dist < 4) {
				color = "#A58BBA";
			}
			else if (4 <= dist && dist < 6) {
				color = "#8A749B";
			}
			else if (6 <= dist && dist < 8) {
				color = "#6E5D7C";
			}
			else if (8 <= dist && dist < 10) {
				color = "#53465E";
			}
			break;
	}
	return color;
}


mp.events.addCommand(
{
	'me' : (player, fullText) => {
		sayME(player, fullText);
	}, 
	
	'do' : (player, fullText) => {
		sayDO(player, fullText);
	}, 
	
});
	

function sayME(player, text, anon = false) {
	mp.players.forEachInRange(player.position, 10, (client) => {
		let dist = client.dist(player.position);
		let color = getColorInRange("purple", dist);
		const currentTime = time.getTime();

		updateLanguage(client);

		if (anon) {
			client.outputChatBox(`!{${color}}[${currentTime}] ${someoneText}: ${text}.`);
		}
		else {
			client.outputChatBox(`!{${color}}[${currentTime}] ${player.name} ${text}.`);
		}
		misc.log.debug(`${player.name} ${text}.`);
	});
}
module.exports.sayME = sayME;
	
function sayDO(player, text, anon = false) {
	mp.players.forEachInRange(player.position, 10, (client) => {
		let dist = client.dist(player.position);
		let color = getColorInRange("purple", dist);
		const currentTime = time.getTime();
		if (anon) {
			client.outputChatBox(`!{${color}}[${currentTime}] ${text}.`);
		}
		else {
			client.outputChatBox(`!{${color}}[${currentTime}] ${text} | ${player.name}.`);
		}
		misc.log.debug(`${text} | ${player.name}.`);
	});
}
module.exports.sayDO = sayDO;


mp.events.addCommand("g", (player, message) => {
	mp.players.broadcast(`${player.name}: ${message}`);

});