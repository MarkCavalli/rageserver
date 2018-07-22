"use strict"

const misc = require('../sMisc');

let currentWeather;
const weathers = 
[	"ExtraSunny", 	// 0
	"Clear",  		// 1
	"Clouds", 		// 2
	"Smog", 		// 3
	"Foggy", 		// 4
	"Overcast",		// 5
	"Rain", 		// 6
	"Thunder", 		// 7
	"Clearing", 	// 8
	"Neutral", 		// 9
	"Blizzard", 	// 10
	"Snowlight", 	// 11
	"Halloween",	// 12
	"xmax",			// 13
];
				
 
 
function changeWeather() {
	const chance = misc.getRandomInt();
	if (chance <= 25) return;  // Continue current weather
		if (currentWeather === 5) {
		return changeWeatherTo(6);
	}
	if (currentWeather === 6) {
		const chance = misc.getRandomInt();
		if (chance <= 33) {
		return changeWeatherTo(7);
		}
		else {
			return changeWeatherTo(8)
		}
	}
	if (currentWeather === 7) {
		return changeWeatherTo(6);
	}
	else {
		changeToSunWeather();
	}
}
module.exports.changeWeather = changeWeather;

function changeWeatherTo(number) {
	currentWeather = number;
	//mp.world.weather = weathers[number];
	mp.world.setWeatherTransition(weathers[number]);
	misc.log.trace(`Current weather: ${weathers[number]}`);
}

function changeToSunWeather() {
	const rnd = misc.getRandomInt();
	let next;
	if (rnd <= 30) {
		next = 0;
	}
	else if (30 < rnd && rnd <= 55) {
		next = 1;
	}
	else if (55 < rnd && rnd <= 65) {
		next = 2;
	}
	else if (65 < rnd && rnd <= 75) {
		next = 3;
	}
	else if (75 < rnd && rnd <= 85) {
		next = 4;
	}
	else if (85 < rnd) {
		next = 5;
	}
 	return changeWeatherTo(next);
}

changeWeather();
  


mp.events.addCommand(
{
	'w' : (player, fullText, id) => {
		if (misc.getAdminLvl(player) < 1) {
			return;
		}
		changeWeatherTo(+id);
		player.outputChatBox("Current weather: " +weathers[id]);
	},
	
});    

