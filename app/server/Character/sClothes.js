"use strict"

const misc = require('../sMisc');


const manHats = [	
	{	id: 8, 	name: "Without Hat",color: 0, colors: [0], 							price: 0,  },
	{	id: 2, 	name: "Cap", 		color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7], 	price: 500,  },
	{	id: 3, 	name: "Panama", 	color: 0, colors: [1, 2], 						price: 600,  },
	{	id: 4, 	name: "LS Cap", 	color: 0, colors: [0, 1], 						price: 1000,  },
	{	id: 5, 	name: "Cap", 		color: 0, colors: [0, 1], 						price: 500,  },
	{	id: 6, 	name: "Army Cap", 	color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7], 	price: 700,  },
];
exports.manHats = manHats;

const manGlasses = [	
	{	id: 0, name: "Without Glasses", color: 0, colors: [0], 									price: 0,  },
	{	id: 1, name: "Glasses №1", 		color: 0, colors: [1], 									price: 500,  },
	{	id: 2, name: "Glasses №2", 		color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 	price: 450,  },
];
exports.manGlasses = manGlasses;

const manTops = [	
	{	id: 0, name: "Simple T-Shirt", color: 0, colors: [0, 1, 2, 3, 4, 5, 7, 8, 11], price: 650, torso: 0, undershirt: 15, underColor: 0, underColors: [0], 		},
	{	id: 1, name: "Simple T-Shirt", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14], price: 550, torso: 0, undershirt: 15, underColor: 0, underColors: [0], 		},
	{	id: 5, name: "Undershirt", color: 0, colors: [0, 1, 2, 7], price: 350, torso: 5, undershirt: 15, underColor: 0, underColors: [0], 	},
	{	id: 8, name: "Shirt", color: 0, colors: [0, 10, 13, 14], price: 700, torso: 8, undershirt: 15, underColor: 0, underColors: [0], 	},
	{	id: 13, name: "Shirt", color: 0, colors: [0, 1, 2, 3, 5, 13], price: 800, torso: 11, undershirt: 15, underColor: 0, underColors: [0], 	},
	{	id: 14, name: "Shirt", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 950, torso: 12, undershirt: 15, underColor: 0, underColors: [0], 	},
	{	id: 16, name: "T-Shirt", color: 0, colors: [0, 1, 2], price: 600, torso: 0, undershirt: 15, underColor: 0, underColors: [0], 	},
	{	id: 17, name: "Undershirt", color: 0, colors: [0, 1, 2, 3, 4, 5], price: 700, torso: 5, undershirt: 15, underColor: 0, underColors: [0], 	},
	{	id: 18, name: "Colored Shirt", color: 0, colors: [0, 1, 2, 3], price: 900, torso: 0, undershirt: 15, underColor: 0, underColors: [0], 	},

	
];
exports.manTops = manTops;

const manLegs = [	
	{	id: 0, name: "Fit Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 750,  },
	{	id: 1, name: "Wide Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 1000,  },
];
exports.manLegs = manLegs;

const manFeet = [	
	{	id: 1, name: "Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 600,  },
	{	id: 3, name: "Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 550,  },
	{	id: 4, name: "High Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 500,  },
	{	id: 5, name: "Bedroom Slippers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 400,  },
];
exports.manFeet = manFeet;






const womanHats = [	
	{	id: 57, 	name: "Without Hat",color: 0, colors: [0], 	price: 0,  },
];
exports.womanHats = womanHats;

const womanGlasses = [	
	{	id: 13, name: "Without Glasses", color: 0, colors: [0], 										price: 0,  },
	{	id: 0, name: "Glasses №1", 		color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 		price: 500,  },
	{	id: 21, name: "Glasses №2", 	color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 		price: 450,  },
];
exports.womanGlasses = womanGlasses;

const womanTops = [	
	{	id: 0, name: "Simple T-Shirt", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 500, torso: 0, undershirt: 15, underColor: 0, underColors: [0], 		},
	{	id: 2, name: "Simple T-Shirt", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 650, torso: 2, undershirt: 15, underColor: 0, underColors: [0], 		},
	{	id: 3, name: " Jersey", color: 0, colors: [0, 1, 2, 3, 4, 10, 11, 12, 13, 14], price: 750, torso: 3, undershirt: 15, underColor: 0, underColors: [0], 		},
	{	id: 4, name: " Sport Undershirt", color: 0, colors: [13, 14], price: 450, torso: 4, undershirt: 15, underColor: 0, underColors: [0], 		},
	{	id: 5, name: " Sport Undershirt", color: 0, colors: [0, 1, 7, 9], price: 450, torso: 4, undershirt: 15, underColor: 0, underColors: [0], 		},
		
];
exports.womanTops = womanTops;

const womanLegs = [	
	{	id: 0, name: "Fit Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 750,  },
	{	id: 1, name: "Wide Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 1000,  },
];
exports.womanLegs = womanLegs;

const womanFeet = [	
	{	id: 1, name: "Shoes", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 800,  },
	{	id: 2, name: "Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 550,  },
];
exports.womanFeet = womanFeet;





function getPrice(player, title, number) {
	switch (title) {
		case "Hats":
			if (player.model === 1885233650) return manHats[number].price;
			else return womanHats[number].price;

		case "Glasses":
			if (player.model === 1885233650) return manGlasses[number].price;
			else return womanGlasses[number].price;

		case "Tops":
			if (player.model === 1885233650) return manTops[number].price;
			else return womanTops[number].price;

		case "Legs":
			if (player.model === 1885233650) return manLegs[number].price;
			else return womanLegs[number].price;

		case "Feet":
			if (player.model === 1885233650) return manFeet[number].price;
			else return womanFeet[number].price;

	}
}
exports.getPrice = getPrice;


mp.events.add(
{
	"sClothesSetCloth" : (player, obj) => {
		const d = JSON.parse(obj);
		setClothes(player, d);
	},
	
});



function setClothes(player, d) {
	if (player.model === 1885233650) {
		setManClothes(player, d.title, d);
	}
	else {
		setWomanClothes(player, d.title, d);
	}
}
exports.setClothes = setClothes;





function setManClothes(player, title, d) {
	switch (title) {
		case "Hats":
			player.setProp(0, manHats[d.number].id, d.color);
			break;
		case "Glasses":
			player.setProp(1, manGlasses[d.number].id, d.color);
			break;
		case "Tops":
			player.setClothes(11, manTops[d.number].id, d.color, 0);
			player.setClothes(3, manTops[d.number].torso, 0, 0);
			player.setClothes(8, manTops[d.number].undershirt, d.underColor, 0);
			break;
		case "Legs":
			player.setClothes(4, manLegs[d.number].id, d.color, 0);
			break;
		case "Feet":
			player.setClothes(6, manFeet[d.number].id, d.color, 0);
			break;
	}
}
exports.setManClothes = setManClothes;


function setWomanClothes(player, title, d) {
	switch (title) {
		case "Hats":
			player.setProp(0, womanHats[d.number].id, d.color);
			break;
		case "Glasses":
			player.setProp(1, womanGlasses[d.number].id, d.color);
			break;
		case "Tops":
			player.setClothes(11, womanTops[d.number].id, d.color, 0);
			player.setClothes(3, womanTops[d.number].torso, 0, 0);
			player.setClothes(8, womanTops[d.number].undershirt, d.underColor, 0);
			break;
		case "Legs":
			player.setClothes(4, womanLegs[d.number].id, d.color, 0);
			break;
		case "Feet":
			player.setClothes(6, womanFeet[d.number].id, d.color, 0);
			break;
	}
}
exports.setWomanClothes = setWomanClothes;


async function saveClothes(player, d) {
	const obj = {
		number: d.number,
		color: d.color,
	}

	switch (d.title) {
		case "Hats":
			await misc.query(`UPDATE userskins SET hats = '${JSON.stringify(obj)}' WHERE id = ${player.info.id}`);
			break;

		case "Glasses":
			await misc.query(`UPDATE userskins SET glasses = '${JSON.stringify(obj)}' WHERE id = ${player.info.id}`);
			break;

		case "Tops":
			obj.underColor = d.underColor;
			await misc.query(`UPDATE userskins SET tops = '${JSON.stringify(obj)}' WHERE id = ${player.info.id}`);
			break;

		case "Legs":
			await misc.query(`UPDATE userskins SET legs = '${JSON.stringify(obj)}' WHERE id = ${player.info.id}`);
			break;

		case "Feet":
			await misc.query(`UPDATE userskins SET feet = '${JSON.stringify(obj)}' WHERE id = ${player.info.id}`);
			break;

	}

}
exports.saveClothes = saveClothes;




async function loadPlayerClothes(player) {
	const d = await misc.query(`SELECT hats, glasses, tops, legs, feet FROM userskins WHERE id = '${player.info.id}'`);

	if(d[0].hats) {
		const hats = JSON.parse(d[0].hats);
		hats.title = "Hats";
		setClothes(player, hats);
	}
	
	if (d[0].glasses) {
		const glasses = JSON.parse(d[0].glasses);
		glasses.title = "Glasses";
		setClothes(player, glasses);
	}

	if (d[0].tops) {
		const tops = JSON.parse(d[0].tops);
		tops.title = "Tops";
		setClothes(player, tops);
	}

	if (d[0].legs) {
		const legs = JSON.parse(d[0].legs);
		legs.title = "Legs";
		setClothes(player, legs);
	}
	
	if (d[0].feet) {
		const feet = JSON.parse(d[0].feet);
		feet.title = "Feet";
		setClothes(player, feet);
	}

}
exports.loadPlayerClothes = loadPlayerClothes;