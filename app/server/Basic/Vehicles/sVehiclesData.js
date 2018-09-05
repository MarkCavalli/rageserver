class VehiclesDataSingleton {
	constructor() {
		this.vehicles = [
			{	model: "peyote", 		title: "Vapid Peyote", 				fuelTank: 45, 	fuelRate: 11, 	price: 20000,	},
			{	model: "emperor2",		title: "Albany Emperor", 			fuelTank: 60, 	fuelRate: 16, 	price: 20000,	},
			{	model: "dloader", 		title: "Bravado Duneloader", 		fuelTank: 80, 	fuelRate: 25, 	price: 20000,	},
			{ 	model: "dilettante",	title: "Karin Dilettante", 			fuelTank: 40, 	fuelRate: 2, 	price: 25000,	},
			{	model: "tornado3", 		title: "Declasse Tornado", 			fuelTank: 50, 	fuelRate: 11, 	price: 25000,	},
			{	model: "panto", 		title: "Benefactor Panto", 			fuelTank: 40, 	fuelRate: 4, 	price: 30000,	},
			{	model: "tornado4", 		title: "Declasse Tornado", 			fuelTank: 50, 	fuelRate: 11, 	price: 30000,	},
			{	model: "bfinjection",	title: "BF Injection",				fuelTank: 45,	fuelRate: 8,	price: 30000,	},
			{	model: "issi2",			title: "Weeny Issi",				fuelTank: 50,	fuelRate: 7,	price: 40000,	},
			{	model: "moonbeam",		title: "Declasse Moonbeam",			fuelTank: 70,	fuelRate: 25,	price: 40000,	},
			{	model: "rebel",			title: "Karin Rebel",				fuelTank: 65,	fuelRate: 18,	price: 40000,	},
			{	model: "blista",		title: "Dinka Blista",				fuelTank: 45,	fuelRate: 6,	price: 45000,	},
			{	model: "brioso",		title: "Grotti Brioso R/A",			fuelTank: 40,	fuelRate: 5,	price: 50000,	},
			{	model: "voodoo2",		title: "Declasse Voodoo",			fuelTank: 55,	fuelRate: 16,	price: 50000,	},
			{	model: "prairie",		title: "Bollokan Prairie",			fuelTank: 55,	fuelRate: 9,	price: 50000,	},
			{	model: "rhapsody",		title: "DeClasse Rhapsody",			fuelTank: 50,	fuelRate: 7,	price: 55000,	},
			{	model: "rebel2",		title: "Karin Rebel",				fuelTank: 65,	fuelRate: 17,	price: 55000,	},
			{	model: "regina",		title: "Dundreary Regina",			fuelTank: 45,	fuelRate: 7,	price: 60000,	},
			{	model: "bifta",			title: "BF Bifta",					fuelTank: 40,	fuelRate: 6,	price: 65000,	},
			{	model: "emperor",		title: "Albany Emperor",			fuelTank: 60,	fuelRate: 15,	price: 65000,	},
			{	model: "ingot",			title: "Vulcar Ingot",				fuelTank: 60,	fuelRate: 9,	price: 70000,	},
			{	model: "pigalle",		title: "Lampadati Pigalle",			fuelTank: 55,	fuelRate: 12,	price: 70000,	},
			{	model: "tornado",		title: "Declasse Tornado",			fuelTank: 50,	fuelRate: 10,	price: 70000,	},
			{	model: "slamvan",		title: "Vapid Slamvan",				fuelTank: 60,	fuelRate: 20,	price: 80000,	},
			{	model: "blade",			title: "Vapid Blade",				fuelTank: 65,	fuelRate: 20,	price: 80000,	},
			{	model: "tornado2",		title: "Declasse Tornado",			fuelTank: 50,	fuelRate: 10,	price: 80000,	},
			{	model: "tornado5",		title: "Declasse Tornado Custom",	fuelTank: 55,	fuelRate: 10,	price: 90000,	},
			{	model: "buccaneer",		title: "Albany Buccaneer",			fuelTank: 75,	fuelRate: 35,	price: 130000,	},
			{	model: "surge",			title: "Cheval Surge",				fuelTank: 20,	fuelRate: 3,	price: 130000,	},
			{	model: "serrano",		title: "Benefactor Serrano",		fuelTank: 50,	fuelRate: 12,	price: 135000,	},
			{	model: "glendale",		title: "Benefactor Glendale",		fuelTank: 60,	fuelRate: 10,	price: 135000,	},
			{	model: "faction",		title: "Willard Faction",			fuelTank: 70,	fuelRate: 25,	price: 140000,	},
			{	model: "asea",			title: "DeClasse Asea",				fuelTank: 45,	fuelRate: 8.5,	price: 140000,	},
			{	model: "radi",			title: "Vapid Radius",				fuelTank: 50,	fuelRate: 13,	price: 145000,	},
			{	model: "chino",			title: "Vapid Chino",				fuelTank: 75,	fuelRate: 35,	price: 150000,	},
			{	model: "voodoo",		title: "Declasse Voodoo Custom",	fuelTank: 55,	fuelRate: 15,	price: 150000,	},
			{	model: "asterope",		title: "Karin Asterope",			fuelTank: 45,	fuelRate: 9,	price: 150000,	},
			{	model: "primo",			title: "Albany Primo",				fuelTank: 50,	fuelRate: 9,	price: 150000,	},
			{	model: "manana",		title: "Albany Manana",				fuelTank: 60,	fuelRate: 14,	price: 150000,	},

			{	model: "mule",			title: "Maibatsu Mule",				fuelTank: 160,	fuelRate: 20,	price: 25000,	},
			{	model: "mule2",			title: "Maibatsu Mule 2",			fuelTank: 200,	fuelRate: 25,	price: 50000,	},
			{	model: "mule3",			title: "Maibatsu Mule 3",			fuelTank: 200,	fuelRate: 28,	price: 75000,	},
			{	model: "mule4",			title: "Maibatsu Mule Custom",		fuelTank: 250,	fuelRate: 30,	price: 150000,	},
		
		];
	}

	getPrice(model) {
		for (let i = 0; i < this.vehicles.length; i++) {
			if (model !== this.vehicles[i].model) continue;
			return this.vehicles[i].price;
		}
		return false;
	}

	getData(model) {
		for (let i = 0; i < this.vehicles.length; i++) {
			if (model !== this.vehicles[i].model) continue;
			return this.vehicles[i];
		}
		return false;
	}

}
const vehiclesDataSingleton = new VehiclesDataSingleton();
module.exports = vehiclesDataSingleton;