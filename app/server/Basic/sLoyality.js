"use strict"

const misc = require('../sMisc');
const i18n = require('../sI18n');


class sLoyality {
	constructor() {
	}

	add(player, value) {
		if (!misc.isValueNumber(value)) return;
		value = misc.roundNum(value);
		if (value === 0) return;
		player.basic.loyality += value;
		this.showNotification(player, value);
	}

	remove(player, value) {
		if (!misc.isValueNumber(value)) return;
		value = misc.roundNum(value);
		player.basic.loyality -= value;
		if (player.basic.loyality < 0) player.basic.loyality = 0;
		this.showNotification(player, -value);
	}

	showNotification(player, value) {
		let plus = "";
		if (value > 0) plus = "+";
		player.notify(`${i18n.get('sLoyality', 'loyality', player.lang)} ~b~${plus}${value}`);
	}
}
const loyality = new sLoyality();

function add(player, value) {
	loyality.add(player, value);
}
module.exports.add = add;

function remove(player, value) {
	loyality.remove(player, value);
}
module.exports.remove = remove;

function get(player) {
	return player.basic.loyality;
}
module.exports.get = get;
 