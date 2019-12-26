
const misc = require('../../sMisc');
const i18n = require('../../sI18n');

const vehiclesDataSingleton = require('./sVehiclesData');
const Vehicle = require('./sVehicle');



class VehicleSingleton {
	constructor() {
		
		mp.events.add({
			"playerStartExitVehicle" : (player) => {
				if (player.vehicle.engine) player.vehicle.engine = true;
			},

			"playerEnterVehicle" : (player, vehicle, seat) => {
				if (seat === -1) player.call("cVehicle-setFuel", [vehicle.fuel, vehicle.fuelRate]);
			},
			
			"playerExitVehicle" : (player, vehicle, seat) => {
				player.call("cVehicle-setFuel", [null, 0]);
				player.call("cVehicle-setLights", [vehicle, 0]);
			},

			"sVehicle-SetFuel" : (player, vehicle, fuel) => {
				vehicle.fuel = misc.roundNum(fuel, 3);
				if (fuel <= 0.1) vehicle.engine = false;
			},

			"sKeys-Num0" : (player) => {
				if (!player.loggedIn || !player.isDriver() || player.vehicle.fuel <= 0.1) return;
				player.vehicle.engine = !player.vehicle.engine;
			},

			"sKeys-Num+" : (player) => {
				if (!player.loggedIn) return;
				const vehicle = this.getNearestPlayerVehicleInRange(player, 50);
				if (vehicle) vehicle.toggleDoorsLock(player);
			},

			"sKeys-Num7" : (player) => {
				if (!player.loggedIn || !player.vehicle) return;
				player.vehicle.toggleWindow(player, 0);
			},

			"sKeys-Num9" : (player) => {
				if (!player.loggedIn || !player.vehicle) return;
				player.vehicle.toggleWindow(player, 1);
			},

			"sKeys-Num1" : (player) => {
				if (!player.loggedIn || !player.vehicle) return;
				player.vehicle.toggleWindow(player, 2);
			},

			"sKeys-Num3" : (player) => {
				if (!player.loggedIn || !player.vehicle) return;
				player.vehicle.toggleWindow(player, 3);
			},

			"sVehicle-SellToGovernment" : (player, id) => {
				mp.vehicles.at(id).sellToGovernment(player)
			},

			"sVehicle-SellToPlayer" : (player, str) => {
				this.sellVehicleToPlayer(player, str);
			},

			"sVehicle-ConfirmSellVehicleToPlayer" : (player, sellerId, price) => {
				this.confirmSellVehicleToPlayer(player, sellerId, price);
			},

			"sVehicle-RejectSellVehicleToPlayer" : (player, sellerId) => {
				this.rejectSellVehicleToPlayer(player, sellerId);
			},

		});


		mp.events.addCommand({	
			'v' : (player, fullText, model) => {
				if (player.adminlvl < 1) return;
				if (!model) return player.notify("Model required");
				const d = {
					model,
					coord: misc.getPlayerCoordJSON(player),
					id: 0,
					title: model,
					fuel: 50,
					fuelTank: 60,
					fuelRate: 10,
					price: 1,
					ownerId: 0,
					whoCanOpen: JSON.stringify([player.guid]),
					factionName: '',
					numberPlate: this.generateRandomNumberPlate(),
					primaryColor: JSON.stringify([ misc.getRandomInt(0, 159), misc.getRandomInt(0, 159), misc.getRandomInt(0, 159) ]),
					secondaryColor: JSON.stringify([ misc.getRandomInt(0, 159), misc.getRandomInt(0, 159), misc.getRandomInt(0, 159) ]),
				}
				const vehicle = new Vehicle(d);
				player.putIntoVehicle(vehicle, -1);
				misc.log.debug(`${player.name} spawned ${model}`);
			},
		
			'veh' : (player) => {  // Temporary vehicle spawning
				if (player.health < 5) return;
				const d = {
					model: 'faggio2',
					coord: misc.getPlayerCoordJSON(player),
					id: 0,
					title: 'Pegassi Faggio',
					fuel: 1,
					fuelTank: 5,
					fuelRate: 2,
					price: 1,
					ownerId: 0,
					whoCanOpen: JSON.stringify([player.guid]),
					factionName: '',
					numberPlate: this.generateRandomNumberPlate(),
					primaryColor: JSON.stringify([ misc.getRandomInt(0, 159), misc.getRandomInt(0, 159), misc.getRandomInt(0, 159) ]),
					secondaryColor: JSON.stringify([ misc.getRandomInt(0, 159), misc.getRandomInt(0, 159), misc.getRandomInt(0, 159) ]),
				}
				new Vehicle(d);
				misc.log.debug(`${player.name} spawned faggio2`);
				player.notify(`${i18n.get('sVehicle', 'helpUnlock', player.lang)}`);
				player.notify(`${i18n.get('sVehicle', 'helpEngine', player.lang)}`);		
			},
		
			'tp' : (player, fullText, a, b, c) => { 
				if (player.adminlvl < 1) return;
				player.position = new mp.Vector3(+a, +b, +c);
			},
		
		});
	}

	generateRandomNumberPlate() {
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let number = '';
		for (let i = 0; i < 8; i++) {
			number += possible.charAt(misc.getRandomInt(0, possible.length));
		}
		return number;
	}

	getNearestPlayerVehicleInRange(player, range) {
		const vehiclesInRange = [];
		const vehicles = mp.vehicles.toArray();
		for (const vehicle of vehicles) {
			if (vehicle.dist(player.position) > range) continue;
			if (!vehicle.canOpen(player)) continue;
			vehiclesInRange.push(vehicle);
		}
		let nearestVeh = vehiclesInRange[0];
		for (const vehicle of vehiclesInRange) {
			if (vehicle.dist(player.position) < nearestVeh.dist(player.position)) nearestVeh = vehicle;
		}
		return nearestVeh;		
	}

	async sellVehicleToPlayer(seller, str) {
		if (!seller.vehicle) return;
		const data = JSON.parse(str);
		const buyer = mp.players.at(data.passengerId);
		if (!buyer) return;
		let execute = `app.whoName = '${seller.name}';`;
		execute += `app.whoId = ${seller.id};`;
		execute += `app.wantText = '${i18n.get('sVehicle', 'wantsSellVehicleToPlayer', buyer.lang)} ${seller.vehicle.title} | ${seller.vehicle.numberPlate}';`;
		execute += `app.price = ${data.price};`;

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
		if (!buyer.vehicle || buyer.vehicle !== seller.vehicle) return;
		const canBuy = await buyer.changeMoney(-price);
		if (!canBuy) return;
		await seller.changeMoney(price);
		buyer.vehicle.ownerId = buyer.guid;
		buyer.vehicle.whoCanOpen = [buyer.guid];
		await misc.query(`UPDATE vehicles SET ownerId = '${buyer.guid}', whoCanOpen = '${JSON.stringify([buyer.guid])}' WHERE id = '${buyer.vehicle.guid}' LIMIT 1`);

		seller.notify(`~g~${buyer.name} ${i18n.get('basic', 'confirmedYourOffer', seller.lang)}!`);
		buyer.notify(`~g~${i18n.get('basic', 'youConfirmedOffer', buyer.lang)} ${seller.name}!`);

		misc.log.debug(`${seller.name} sold ${seller.vehicle.title}(${seller.vehicle.guid}) for $${price} to ${buyer.name}`);
	}

	getVehiclesForPlayerMenu(id) {
		const playerVehicles = [];
		const vehicles = mp.vehicles.toArray();
		for (const veh of vehicles) {
			if (veh.ownerId !== id) continue;
			const v = {
				id: veh.id,
				title: veh.title,
				number: veh.numberPlate,
				price: veh.price,
				fTank: veh.fuelTank,
				fRate: veh.fuelRate
			}
			playerVehicles.push(v);
		}
		return JSON.stringify(playerVehicles);
	}

	getPassengersForPlayerMenu(player) {
		if (!player.vehicle) return false;
		const passengers = player.vehicle.getOccupants();
		if (passengers < 2) return false;
		const playerPassengers = [];
		for (const pass of passengers) {
			if (pass.name === player.name) continue;
			const p = {
				id: pass.id,
				name: pass.name,
			}
			playerPassengers.push(p);
		}
		return JSON.stringify(playerPassengers);
	}

	async saveNewCar(player, model, coord, color = false) {
		const carData = vehiclesDataSingleton.getData(model);
		if (!color) color = [misc.getRandomInt(0, 255), misc.getRandomInt(0, 255), misc.getRandomInt(0, 255)];
		const d = {
			model,
			title: carData.title,
			fuel: carData.fuelTank,
			fuelTank: carData.fuelTank,
			fuelRate: carData.fuelRate,
			price: carData.price,
			ownerId: player.guid,
			whoCanOpen: JSON.stringify([player.guid]),
			primaryColor: JSON.stringify(color),
			secondaryColor: JSON.stringify(color),
			numberPlate: this.generateRandomNumberPlate(),
		}
		await misc.query(`INSERT INTO vehicles 
			(model, title, fuel, fuelTank, fuelRate, price, ownerId, whoCanOpen, primaryColor, secondaryColor, numberPlate, coord) VALUES
			('${d.model}', '${d.title}', '${d.fuel}', '${d.fuelTank}', '${d.fuelRate}', '${d.price}', '${d.ownerId}', '${d.whoCanOpen}', '${d.primaryColor}', '${d.secondaryColor}', '${d.numberPlate}', '${coord}')`);
	
		const car = await misc.query(`SELECT * FROM vehicles WHERE ownerId = '${player.guid}' ORDER BY id DESC LIMIT 1`);
		new Vehicle(car[0]);
	}

	savePlayerVehicles(ownerId) {
		const vehicles = mp.vehicles.toArray();
		for (const vehicle of vehicles) {
			if (vehicle.ownerId !== ownerId) continue;
			const obj = {
                x: misc.roundNum(vehicle.position.x, 1),
                y: misc.roundNum(vehicle.position.y, 1),
                z: misc.roundNum(vehicle.position.z, 1),
                rot: misc.roundNum(vehicle.rotation.z, 1),
                dim: vehicle.dimension,
			}
			const f = vehicle.fuel;
			const id = vehicle.guid;
			misc.query(`UPDATE vehicles SET coord = '${JSON.stringify(obj)}', fuel = '${f}' WHERE id = '${id}'`);
//			vehicle.destroy();
		}
	}

	async loadPlayerVehicles(id) {
		const data = await misc.query(`SELECT * FROM vehicles WHERE ownerId = '${id}'`);
		for (const d of data) new Vehicle(d);
	}

	async loadFactionVehicles(name) {
		const vehicles = await misc.query(`SELECT * FROM vehicles WHERE factionName = '${name}'`);
		for (const veh of vehicles) new Vehicle(veh);
	}

}
const vehicleSingleton = new VehicleSingleton();
module.exports = vehicleSingleton;
