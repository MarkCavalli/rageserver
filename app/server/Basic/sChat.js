"use strict"

const i18n = require('../sI18n');
const misc = require('../sMisc');
const time = require('./sTime');



class sChat {
	constructor () {
		mp.events.add('playerChat', (player, message) => {
			this.sayRP(player, message);
			misc.log.debug(`${player.name}[${player.id}]: ${message}`);
		});

		mp.events.addCommand({
			'me' : (player, fullText) => {
				this.sayME(player, fullText);
			}, 
			
			'do' : (player, fullText) => {
				this.sayDO(player, fullText);
			}, 

			'g' : (player, fullText) => {
				mp.players.broadcast(`[${time.getTime()}] ${player.name}: ${fullText}`);
			}, 
			
		});
	}

	getColorInRange(color, dist) {
		if (color === 'white') return getWhite(dist);
		else if (color === 'purple') return getPurple(dist);


		function getWhite(dist) {
			if (0 <= dist && dist < 2) return '#ffffff';
			else if (2 <= dist && dist < 4) return '#cecece';
			else if (4 <= dist && dist < 6) return '#afafaf';
			else if (6 <= dist && dist < 8) return '#919191';
			else if (8 <= dist && dist < 10) return '#727272';
		}
		function getPurple(dist) {
			if (0 <= dist && dist < 2) return '#c2a2da';
			else if (2 <= dist && dist < 4) return '#a58bba';
			else if (4 <= dist && dist < 6) return '#8a749b';
			else if (6 <= dist && dist < 8) return '#6e5d7c';
			else if (8 <= dist && dist < 10) return '#53465e';
		}
	}

	sayRP(player, text, anon = false) {
		mp.players.forEachInRange(player.position, 10, (client) => {
			const dist = client.dist(player.position);
			const color = this.getColorInRange("white", dist);
			const currentTime = time.getTime();
			if (anon) {
				client.outputChatBox(`!{${color}}[${currentTime}] ${i18n.get('sChat', 'someone', player.lang)}: ${text}`);
			}
			else {
				client.outputChatBox(`!{${color}}[${currentTime}] ${player.name}[${player.id}]: ${text}`);
			}
		});
	}

	sayME(player, text, anon = false) {
		mp.players.forEachInRange(player.position, 10, (client) => {
			const dist = client.dist(player.position);
			const color = this.getColorInRange("purple", dist);
			const currentTime = time.getTime();
			if (anon) {
				client.outputChatBox(`!{${color}}[${currentTime}] ${i18n.get('sChat', 'someone', player.lang)}: ${text}`);
			}
			else {
				client.outputChatBox(`!{${color}}[${currentTime}] ${player.name} ${text}`);
			}
			misc.log.debug(`${player.name} ${text}.`);
		});
	}

	sayDO(player, text, anon = false) {
		mp.players.forEachInRange(player.position, 10, (client) => {
			const dist = client.dist(player.position);
			const color = this.getColorInRange("purple", dist);
			const currentTime = time.getTime();
			if (anon) {
				client.outputChatBox(`!{${color}}[${currentTime}] ${text}`);
			}
			else {
				client.outputChatBox(`!{${color}}[${currentTime}] ${text} | ${player.name}`);
			}
			misc.log.debug(`${text} | ${player.name}.`);
		});
	}
}
const chat = new sChat();


function sayRP(player, text, anon = false) {
	chat.sayRP(player, text, anon);
}
module.exports.sayRP = sayRP;

function sayME(player, text, anon = false) {
	chat.sayME(player, text, anon);
}
module.exports.sayME = sayME;
	
function sayDO(player, text, anon = false) {
	chat.sayDO(player, text, anon);
}
module.exports.sayDO = sayDO;