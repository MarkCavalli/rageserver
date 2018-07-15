"use strict"

const misc = require('../sMisc');


let loyalityText;
function updateLanguage(player) {
	loyalityText = "Loyality: ";

	const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
		loyalityText = "Лояльность: ";
	} 
  
	else if (lang === "br") {
		loyalityText = "Fidelidade: ";
	} 
  
  else if (lang === "zhs") {
		loyalityText = "忠诚值: ";
	}
  
  else if (lang === "zht") {
		loyalityText = "忠誠值: ";
	}
	

}


function addLoyality(player, value) {
	if (!misc.isValueNumber(value)) return;
	value = misc.roundNum(value);
	if (value === 0) return;
	player.info.loyality += value;
	showNotification(player, value);
}
module.exports.addLoyality = addLoyality;


function removeLoyality(player, value) {
	if (!misc.isValueNumber(value)) return;
	value = misc.roundNum(value);
	player.info.loyality -= value;
	if (player.info.loyality < 0) player.info.loyality = 0;
	showNotification(player, value);
}
module.exports.removeLoyality = removeLoyality;


function showNotification(player, value) {
	let plus = "";
	if (value > 0) plus = "+";
	updateLanguage(player);
	player.notify(`${loyalityText}~b~${plus}${value}`);
}

function saveLoyality(name, value) {
	if (!misc.isValueNumber(value)) return;
	misc.query(`UPDATE users SET loyality = '${value}' WHERE username = '${name}'`);
}
module.exports.saveLoyality = saveLoyality;



mp.events.addCommand(
{	
	'loyality' : (player) => {  // Temporary show
		updateLanguage(player);
		player.notify(`${loyalityText}~b~${player.info.loyality}`);
	},

});       