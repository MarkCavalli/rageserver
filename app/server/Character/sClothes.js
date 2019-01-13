const misc = require('../sMisc');


class ClothesSingletone {
	constructor() {
		this.manHats = [	
			{	id: 8, 	name: "Without Hat",color: 0, colors: [0], 							price: 0,  },
			{	id: 2, 	name: "Cap", 		color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7], 	price: 500,  },
			{	id: 3, 	name: "Panama", 	color: 0, colors: [1, 2], 						price: 600,  },
			{	id: 4, 	name: "LS Cap", 	color: 0, colors: [0, 1], 						price: 1000,  },
			{	id: 5, 	name: "Cap", 		color: 0, colors: [0, 1], 						price: 500,  },
			{	id: 6, 	name: "Army Cap", 	color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7], 	price: 700,  },
		];

		this.manGlasses = [	
			{	id: 0, name: "Without Glasses", color: 0, colors: [0], 									price: 0,  },
			{	id: 1, name: "Glasses №1", 		color: 0, colors: [1], 									price: 500,  },
			{	id: 2, name: "Glasses №2", 		color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 	price: 450,  },
		];

		this.manTops = [	
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

		this.manLegs = [	
			{	id: 0, name: "Fit Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 750,  },
			{	id: 1, name: "Wide Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 1000,  },
			{	id: 3, name: "Jogging", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 1000,  },
			{	id: 4, name: "Fit Jeans", color: 0, colors: [0, 1, 2, 3, 4], 	price: 1000,  },
		];

		this.manFeet = [	
			{	id: 1, name: "Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 600,  },
			{	id: 3, name: "Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 550,  },
			{	id: 4, name: "High Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 500,  },
			{	id: 5, name: "Bedroom Slippers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 400,  },
		];



		this.womanHats = [	
			{	id: 57, 	name: "Without Hat",color: 0, colors: [0], 	price: 0,  },
		];

		this.womanGlasses = [	
			{	id: 13, name: "Without Glasses", color: 0, colors: [0], 										price: 0,  },
			{	id: 0, name: "Glasses №1", 		color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 		price: 500,  },
			{	id: 21, name: "Glasses №2", 	color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 		price: 450,  },
		];

		this.womanTops = [	
			{	id: 0, name: "Simple T-Shirt", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 500, torso: 0, undershirt: 15, underColor: 0, underColors: [0], 		},
			{	id: 2, name: "Simple T-Shirt", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 650, torso: 2, undershirt: 15, underColor: 0, underColors: [0], 		},
			{	id: 3, name: " Jersey", color: 0, colors: [0, 1, 2, 3, 4, 10, 11, 12, 13, 14], price: 750, torso: 3, undershirt: 15, underColor: 0, underColors: [0], 		},
			{	id: 4, name: " Sport Undershirt", color: 0, colors: [13, 14], price: 450, torso: 4, undershirt: 15, underColor: 0, underColors: [0], 		},
			{	id: 5, name: " Sport Undershirt", color: 0, colors: [0, 1, 7, 9], price: 450, torso: 4, undershirt: 15, underColor: 0, underColors: [0], 		},
				
		];

		this.womanLegs = [	
			{	id: 0, name: "Fit Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 750,  },
			{	id: 1, name: "Wide Jeans", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 	price: 1000,  },
		];

		this.womanFeet = [	
			{	id: 1, name: "Shoes", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 800,  },
			{	id: 2, name: "Sneakers", color: 0, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], price: 550,  },
		];

	}

	getPrice(player, title, number) {
		if (title === "Hats") {
			if (player.model === 1885233650) return this.manHats[number].price;
			else return this.womanHats[number].price;
		}
		else if (title === "Glasses") {
			if (player.model === 1885233650) return this.manGlasses[number].price;
			else return this.womanGlasses[number].price;
		}
		else if (title === "Tops") {
			if (player.model === 1885233650) return this.manTops[number].price;
			else return this.womanTops[number].price;
		}
		else if (title === "Legs") {
			if (player.model === 1885233650) return this.manLegs[number].price;
			else return this.womanLegs[number].price;
		}
		else if (title === "Feet") {
			if (player.model === 1885233650) return this.manFeet[number].price;
			else return this.womanFeet[number].price;
		}
	}

	setClothes(player, d) {
		if (!player.loggedIn) return;
		if (player.model === 1885233650) {
			this.setManClothes(player, d.title, d);
		}
		else {
			this.setWomanClothes(player, d.title, d);
		}
	}

	setManClothes(player, title, d) {
		if (title === "Hats") {
			player.setProp(0, this.manHats[d.number].id, d.color);
		}
		else if (title === "Glasses") {
			player.setProp(1, this.manGlasses[d.number].id, d.color);
		}
		else if (title === "Tops") {
			player.setClothes(11, this.manTops[d.number].id, d.color, 0);
			player.setClothes(3, this.manTops[d.number].torso, 0, 0);
			player.setClothes(8, this.manTops[d.number].undershirt, d.underColor, 0);
		}
		else if (title === "Legs") {
			player.setClothes(4, this.manLegs[d.number].id, d.color, 0);
		}
		else if (title === "Feet") {
			player.setClothes(6, this.manFeet[d.number].id, d.color, 0);
		}
	}

	setWomanClothes(player, title, d) {
		if (title === "Hats") {
			player.setProp(0, this.womanHats[d.number].id, d.color);
		}
		else if (title === "Glasses") {
			player.setProp(1, this.womanGlasses[d.number].id, d.color);
		}
		else if (title === "Tops") {
			player.setClothes(11, this.womanTops[d.number].id, d.color, 0);
			player.setClothes(3, this.womanTops[d.number].torso, 0, 0);
			player.setClothes(8, this.womanTops[d.number].undershirt, d.underColor, 0);
		}
		else if (title === "Legs") {
			player.setClothes(4, this.womanLegs[d.number].id, d.color, 0);
		}
		else if (title === "Feet") {
			player.setClothes(6, this.womanFeet[d.number].id, d.color, 0);
		}
	}

	async saveClothes(player, d) {
		const obj = {
			number: d.number,
			color: d.color,
		}
		if (d.title === "Hats") {
			await misc.query(`UPDATE usersClothes SET hats = '${JSON.stringify(obj)}' WHERE id = ${player.guid}`);
		}
		else if (d.title === "Glasses") {
			await misc.query(`UPDATE usersClothes SET glasses = '${JSON.stringify(obj)}' WHERE id = ${player.guid}`);
		}
		else if (d.title === "Tops") {
			obj.underColor = d.underColor;
				await misc.query(`UPDATE usersClothes SET tops = '${JSON.stringify(obj)}' WHERE id = ${player.guid}`);
		}
		else if (d.title === "Legs") {
			await misc.query(`UPDATE usersClothes SET legs = '${JSON.stringify(obj)}' WHERE id = ${player.guid}`);
		}
		else if (d.title === "Feet") {
			await misc.query(`UPDATE usersClothes SET feet = '${JSON.stringify(obj)}' WHERE id = ${player.guid}`);
		}
	}

	async createNewUser(id) {
		let obj = {	number: 0,	color: 0 };
		obj = JSON.stringify(obj);
		let tops = { number: 0,	color: 0, underColor: 0	};
		tops = JSON.stringify(tops);
		await misc.query(`INSERT INTO usersClothes (id, hats, glasses, tops, legs, feet) VALUES ('${id}', '${obj}', '${obj}', '${tops}', '${obj}', '${obj}');`);
	}

	async loadPlayerClothes(player) {
		const d = await misc.query(`SELECT hats, glasses, tops, legs, feet FROM usersClothes WHERE id = '${player.guid}'`);
		if(d[0].hats) {
			const hats = JSON.parse(d[0].hats);
			hats.title = "Hats";
			this.setClothes(player, hats);
		}
		
		if (d[0].glasses) {
			const glasses = JSON.parse(d[0].glasses);
			glasses.title = "Glasses";
			this.setClothes(player, glasses);
		}
	
		if (d[0].tops) {
			const tops = JSON.parse(d[0].tops);
			tops.title = "Tops";
			this.setClothes(player, tops);
		}
	
		if (d[0].legs) {
			const legs = JSON.parse(d[0].legs);
			legs.title = "Legs";
			this.setClothes(player, legs);
		}
		
		if (d[0].feet) {
			const feet = JSON.parse(d[0].feet);
			feet.title = "Feet";
			this.setClothes(player, feet);
		}
	}
}
const clothesSingletone = new ClothesSingletone();
module.exports = clothesSingletone;


mp.events.add(
{
	"sClothes-SetCloth" : (player, obj) => {
		const d = JSON.parse(obj);
		clothesSingletone.setClothes(player, d);
	},
	
});
