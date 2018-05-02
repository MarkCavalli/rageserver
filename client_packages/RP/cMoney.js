"use strict"

const misc = require('RP/cMisc');
const player = mp.players.local;
let money;

function prettify(num) {
    let n = num.toString();
    const separator = " ";
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + separator);
}

mp.events.add(
{
	"cMoneyUpdate" : (value) => {
		money = value;
	},
	
	"render" : () => {
		if (money && mp.gui.cursor.visible === false) {
			mp.game.graphics.drawText("$" + prettify(money) + "              ", [0.940, 0.025], { 
				font: 7, 
				color: [115, 186, 131, 255], 
				scale: [0.7, 0.7], 
			});
		}
	},
	
});