"use strict"

const misc = require('../sMisc');
const i18n = require('../sI18n');
const moneyAPI = require('./sMoney');


class sVehicle {
	constructor() {
		mp.events.add({
			"playerStartExitVehicle" : (player) => {
				if (player.vehicle.engine) player.vehicle.engine = true;
			},
		
			"playerEnterVehicle" : (player, vehicle, seat) => {
				if (seat === -1) player.call("cVehicle-setFuel", [vehicle.info.fuel, vehicle.info.fuelRate]);
			},
			
			"playerExitVehicle" : (player, vehicle, seat) => {
				player.call("cVehicle-setFuel", [null, 0]);
				this.setLights(player, vehicle, 0);
			},
		
			"sVehicle-SetFuel" : (player, vehicle, fuel) => {
				vehicle.info.fuel = misc.roundNum(fuel, 3);
				if (fuel <= 0.1) vehicle.engine = false;
			},
		
			"sKeys-Num0" : (player) => {
				if (!isDriver(player) || player.vehicle.info.fuel <= 0.1) return;
				this.toggleEngine(player.vehicle);
			},
		
			"sKeys-Num+" : (player) => {
				const vehicle = this.getNearestPlayerVehicleInRange(player, 50);
				if (vehicle) this.toggleDoorsLock(player, vehicle);
			},
		
			"sKeys-Num7" : (player) => {
				this.toggleVehWindow(player, 0);
			},
		
			"sKeys-Num9" : (player) => {
				this.toggleVehWindow(player, 1);
			},
		
			"sKeys-Num1" : (player) => {
				this.toggleVehWindow(player, 2);
			},
		
			"sKeys-Num3" : (player) => {
				this.toggleVehWindow(player, 3);
			},

			"sVehicle-SellToGovernment" : (player, id) => {
				veh.sellVehicleToGovernment(player, id);
			},

			"sVehicle-SellToPlayer" : (player, str) => {
				veh.sellVehicleToPlayer(player, str);
			},

			"sVehicle-ConfirmSellVehicleToPlayer" : (player, sellerId, price) => {
				veh.confirmSellVehicleToPlayer(player, sellerId, price);
			},

			"sVehicle-RejectSellVehicleToPlayer" : (player, sellerId) => {
				veh.rejectSellVehicleToPlayer(player, sellerId);
			},

		});


		mp.events.addCommand({	
			'v' : (player, fullText, model) => {
				if (misc.getAdminLvl(player) < 1) return;
				if (!model) return player.notify("Model required");
				const vehicle = mp.vehicles.new(model, player.position,
				{
					heading: player.heading,
					dimension: player.dimension,
					locked: true,
					engine: false,
				});
			
				const color = misc.getRandomInt(0, 159);
				vehicle.setColor(color, color);
				vehicle.numberPlate = this.generateRandomNumberPlate();
			
				vehicle.info = {
					title: model,
					fuel: 50,
					fuelTank: 50,
					fuelRate: 10,
					owner: "gov",
					whoCanOpen: [player.basic.id],
					windowsOpened: [false, false, false, false],
				}
				player.putIntoVehicle(vehicle, -1);
				misc.log.debug(`${player.name} spawned ${model}`);
			},
		
			'vmod' : (player, fullText, a, b) => { 
				player.vehicle.setMod(parseInt(a), parseInt(b));
			},
		
			'veh' : (player) => {  // Temporary vehicle spawning
				const vehicle = mp.vehicles.new("faggio2", player.position,
				{
					heading: player.heading,
					dimension: player.dimension,
					locked: true,
					engine: false,
				});
			
				const color = misc.getRandomInt(0, 159);
				vehicle.setColor(color, color);
				vehicle.numberPlate = this.generateRandomNumberPlate();
			
				vehicle.info = {
					title: "Pegassi Faggio",
					fuel: 1,
					fuelTank: 5,
					fuelRate: 1.5,
					owner: "gov",
					whoCanOpen: [player.basic.id],
					windowsOpened: [false, false, false, false],
				}
		
				misc.log.debug(`${player.name} spawned faggio2`);
				player.notify(`${i18n.get('sVehicle', 'helpUnlock', player.lang)}`);
				player.notify(`${i18n.get('sVehicle', 'helpEngine', player.lang)}`);
			},
		
			'tp' : (player, fullText, a, b, c) => { 
				if (misc.getAdminLvl(player) < 1) return;
				player.position = new mp.Vector3(parseInt(a), parseInt(b), parseInt(c));
			},
		
		});
	}

	toggleEngine(vehicle) {
		vehicle.engine = !vehicle.engine;
	}

	canOpen(player, vehicle) {
		const peopleWithKeys = vehicle.info.whoCanOpen;
		for (let i = 0; i < peopleWithKeys.length; i++) {
			if (player.dimension !== vehicle.dimension || peopleWithKeys[i] !== player.basic.id) continue;
			//if (player.dimension !== vehicle.dimension || peopleWithKeys[i] !== player.name || vehicle.info.owner !== player.faction.name) continue;
			return true;
		}
		return false;
	}

	getNearestPlayerVehicleInRange(player, range) {
		let vehiclesInRange = [];
		mp.vehicles.forEachInRange(player.position, range, (vehicle) => {
			if (this.canOpen(player, vehicle)) {
				vehiclesInRange.push(vehicle);
			}
		});
		let nearestVeh = vehiclesInRange[0];
		for (let i = 1; i < vehiclesInRange.length; i++) {
			if (vehiclesInRange[i].dist(player.position) < nearestVeh.dist(player.position)) {
				nearestVeh = vehiclesInRange[i];
			}
		}
		return nearestVeh;
	}

	toggleDoorsLock(player, vehicle) {
		if (vehicle.locked) this.unlock(player, vehicle);
		else this.lock(player, vehicle);
		vehicle.locked = !vehicle.locked;
	}

	lock(player, vehicle) {
		player.outputChatBox(`${vehicle.info.title} !{200, 0, 0}${i18n.get('sVehicle', 'locked', player.lang)}`);
		if (vehicle.getOccupants().length === 0) this.blinkLights(vehicle);
	}

	unlock(player, vehicle) {
		player.outputChatBox(`${vehicle.info.title} !{0, 200, 0}${i18n.get('sVehicle', 'unlocked', player.lang)}`);
		if (vehicle.getOccupants().length === 0) {
			this.blinkLights(vehicle);
			setTimeout(() => {
				this.blinkLights(vehicle);
			}, 600);
		}
	}

	blinkLights(vehicle) {
		const engineStatus = vehicle.engine;
		if (!engineStatus) vehicle.engine = true;
	
		const players = mp.players.toArray();
		for (let player of players) {
			this.setLights(player, vehicle, 2);
			setTimeout(() => {
				this.setLights(player, vehicle, 0);
			}, 300);
		}
	
		if (!engineStatus) {
			setTimeout(() => {
				this.toggleEngine(vehicle);
			}, 300);
		}
	}

	setLights(player, vehicle, state) {
		player.call("cVehicle-setLights", [vehicle, state]);
	}

	toggleVehWindow(player, window) {
		const canRoll = this.canRollWindow(player, window);
		if (!canRoll) return;
		const vehicle = player.vehicle;
		const windowOpened = vehicle.info.windowsOpened[window];
		let action;
		if (windowOpened) action = "cVehicle-rollUpWindow";
		else action = "cVehicle-rollDownWindow";
	
		mp.players.forEach((player, id) => {
			player.call(action, [vehicle, window]);
		});
		
		vehicle.info.windowsOpened[window] = !windowOpened;
	}

	
	canRollWindow(player, window) {
		if (!player.vehicle) return;
		if (isDriver(player) || player.seat + 1 === window) {
			return true;
		}
		return false;
	}

	generateRandomNumberPlate() {
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let number = '';
	
		for (let i = 0; i < 8; i++) {
			number += possible.charAt(misc.getRandomInt(0, possible.length));
		}
	
		return number;
	}

	spawnCar(d) {
		const pos = JSON.parse(d.coord);
	
		const vehicle = mp.vehicles.new(d.model, new mp.Vector3(pos.x, pos.y, pos.z),
		{
			heading: pos.rot,
			dimension: d.dim,
			locked: true,
			engine: false,
		});
	
		const whoCanOpen = JSON.parse(d.whoCanOpen);
		const primaryColor = JSON.parse(d.primaryColor);
		const secondaryColor = JSON.parse(d.secondaryColor);
	
		vehicle.setColorRGB(primaryColor[0], primaryColor[1], primaryColor[2], secondaryColor[0], secondaryColor[1], secondaryColor[2]);
		vehicle.numberPlate = d.numberPlate;
	
		vehicle.info = {
			id: d.id,
			title: d.title,
			fuel: d.fuel,
			fuelTank: d.fuelTank,
			fuelRate: d.fuelRate,
			price: d.price,
			ownerId: d.ownerId,
			whoCanOpen: whoCanOpen,
			windowsOpened: [false, false, false, false],
		}
	}

	async saveNewCar(player, model, coord, color = false) {
		const carData = vehData.getCarData(model);
	
		if (!color) color = [misc.getRandomInt(0, 255), misc.getRandomInt(0, 255), misc.getRandomInt(0, 255)];
	
		const d = {
			model: model,
			title: carData.title,
			fuel: carData.fuelTank,
			fuelTank: carData.fuelTank,
			fuelRate: carData.fuelRate,
			price: carData.price,
			ownerId: player.basic.id,
			whoCanOpen: JSON.stringify([player.basic.id]),
			primaryColor: JSON.stringify(color),
			secondaryColor: JSON.stringify(color),
			numberPlate: this.generateRandomNumberPlate(),
		}
	
		await misc.query(`INSERT INTO cars (model, title, fuel, fuelTank, fuelRate, price, ownerId, whoCanOpen, primaryColor, secondaryColor, numberPlate, coord, dim) 
			VALUES 		('${d.model}', '${d.title}', '${d.fuel}', '${d.fuelTank}', '${d.fuelRate}', '${d.price}', '${d.ownerId}', '${d.whoCanOpen}', 
						  '${d.primaryColor}', '${d.secondaryColor}', '${d.numberPlate}', '${coord}', '0')`);
	
		const car = await misc.query(`SELECT * FROM cars WHERE ownerId = '${player.basic.id}' ORDER BY id DESC LIMIT 1`);
		this.spawnCar(car[0]);
	}

	async savePlayerVehicles(ownerId) {
		const vehicles = mp.vehicles.toArray();
		for (let veh of vehicles) {
			if (!veh.info || veh.info.ownerId !== ownerId) continue;
			const coord = misc.convertOBJToJSON(veh.position, veh.rotation.z);
			await misc.query(`UPDATE cars SET coord = '${coord}', fuel = '${veh.info.fuel}', dim = '${veh.dimension}' WHERE id = '${veh.info.id}'`);
			veh.destroy();
		}
	}

	async loadPlayerVehicles(id) {
		const d = await misc.query(`SELECT * FROM cars WHERE ownerId = '${id}'`);
		for (let i = 0; i < d.length; i++) {	
			this.spawnCar(d[i]);
		}
	}

	async sellVehicleToGovernment(player, id) {
		const vehicle = mp.vehicles.at(id);
		if (!vehicle || vehicle.info.ownerId !== player.basic.id) return;
		await moneyAPI.addToBankMoney(player.basic.id, vehicle.info.price / 2, `${i18n.get('sVehicle', 'sellVehicle', player.lang)}`);
		await misc.query(`DELETE FROM cars WHERE id = ${vehicle.info.id} AND ownerId = '${player.basic.id}'`);
		vehicle.destroy();
	}

	async sellVehicleToPlayer(seller, str) {
		const data = JSON.parse(str);
		const buyer = mp.players.at(data.passengerId);
		if (!buyer) return;
		const str1 = `app.whoName = '${seller.name}';`;
		const str2 = `app.whoId = ${seller.id};`;
		const str3 = `app.wantText = '${i18n.get('sVehicle', 'wantsSellVehicleToPlayer', buyer.lang)} ${seller.vehicle.info.title} | ${seller.vehicle.numberPlate}';`;
		const str4 = `app.price = ${data.price};`;
		
		const execute = str1 + str2 + str3 + str4;

		buyer.call("cMisc-CreateChooseWindow", [buyer.lang, execute, "sVehicle-ConfirmSellVehicleToPlayer", "sVehicle-RejectSellVehicleToPlayer"]);
	}

	rejectSellVehicleToPlayer(buyer, sellerId) {
		const seller = mp.players.at(sellerId);
		if (!seller) return;
		buyer.notify(`${i18n.get('basic', 'youRejectedOffer', buyer.lang)} ${seller.name}!`);
		seller.notify(`${buyer.name} ${i18n.get('basic', 'rejectedYourOffer', seller.lang)}!`);
	}

	async confirmSellVehicleToPlayer(buyer, sellerId, price) {
		const seller = mp.players.at(sellerId);
		if (!seller) return;
		const vehicle = buyer.vehicle;
		if (!vehicle || vehicle !== seller.vehicle) return;
		const canBuy = await moneyAPI.changeMoney(buyer, -price);
		if (!canBuy) return;
		await moneyAPI.changeMoney(seller, price);
		vehicle.info.ownerId = buyer.basic.id;
		vehicle.info.whoCanOpen = [buyer.basic.id];
		await misc.query(`UPDATE cars SET ownerId = '${buyer.basic.id}', whoCanOpen = '${JSON.stringify([buyer.basic.id])}' WHERE id = '${vehicle.info.id}'`);

		seller.notify(`~g~${buyer.name} ${i18n.get('basic', 'confirmedYourOffer', seller.lang)}!`);
		buyer.notify(`~g~${i18n.get('basic', 'youConfirmedOffer', buyer.lang)} ${seller.name}!`);

		misc.log.debug(`${seller.name} sold ${seller.vehicle.info.title}(${seller.vehicle.info.id}) for $${price} to ${buyer.name}`);
	}

}

const veh = new sVehicle();


function isDriver(player) {
	if (!player.vehicle || player.seat !== -1) {
		return false;
	}
	return true;
}
module.exports.isDriver = isDriver;


function fillUpVehicle(vehicle, litres) {
	if (!misc.isValueNumber(litres)) return;
	vehicle.info.fuel += litres;
	if (vehicle.info.fuel > vehicle.info.fuelTank) vehicle.info.fuel = vehicle.info.fuelTank;

}
module.exports.fillUpVehicle = fillUpVehicle


function saveNewCar(player, model, coord, color = false) {
	veh.saveNewCar(player, model, coord, color);
}
module.exports.saveNewCar = saveNewCar;


function savePlayerVehicles(ownerId) {
	veh.savePlayerVehicles(ownerId)
}
module.exports.savePlayerVehicles = savePlayerVehicles;

async function loadPlayerVehicles(ownerId) {
	veh.loadPlayerVehicles(ownerId);
}
module.exports.loadPlayerVehicles = loadPlayerVehicles;

function getVehiclesForPlayerMenu(id) {
	const playerVehicles = [];
	const vehicles = mp.vehicles.toArray();
	for (let veh of vehicles) {
		if (!veh.info || veh.info.ownerId !== id) continue;
		const v = {
			id: veh.id,
			title: veh.info.title,
			number: veh.numberPlate,
			price: veh.info.price,
			fTank: veh.info.fuelTank,
			fRate: veh.info.fuelRate
		}
		playerVehicles.push(v);
	}
	return JSON.stringify(playerVehicles);
}
module.exports.getVehiclesForPlayerMenu = getVehiclesForPlayerMenu;

function getPassengersForPlayerMenu(player) {
	if (!player.vehicle) return false;
	const passengers = player.vehicle.getOccupants();
	if (passengers < 2) return false;
	const playerPassengers = [];
	for (let pass of passengers) {
		if (pass.name === player.name) continue;
		const p = {
			id: pass.id,
			name: pass.name,
		}
		playerPassengers.push(p);
	}
	return JSON.stringify(playerPassengers);
}
module.exports.getPassengersForPlayerMenu = getPassengersForPlayerMenu;







class vehiclesData {
	constructor() {
		this.cars = [
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
		
		];
	}

	getCarPrice(model) {
		for (let i = 0; i < this.cars.length; i++) {
			if (model !== this.cars[i].model) continue;
			return this.cars[i].price;
		}
		return false;
	}

	getCarData(model) {
		for (let i = 0; i < this.cars.length; i++) {
			if (model !== this.cars[i].model) continue;
			return this.cars[i];
		}
		return false;
	}

}

const vehData = new vehiclesData();



function getCarPrice(model) {
	return vehData.getCarPrice(model);
}
module.exports.getCarPrice = getCarPrice;