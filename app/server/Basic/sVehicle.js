"use strict"

const misc = require('../sMisc');
const chat = require('./sChat');


let lockText, unlockText;
function updateLanguage(player) {
	lockText = "locked";
	unlockText = "unlocked";

	const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
		lockText = "закрыт";
		unlockText = "открыт";
	}

	else if (lang === "ger") {
		lockText = "gesperrt";
		unlockText = "entsperrt";
	}
	
	else if (lang === "br") {
		lockText = "trancado";
		unlockText = "destrancado";
	}  
  
  else if (lang === "zhs") {
		lockText = "锁住";
		unlockText = "已开锁";
	}     
  
  else if (lang === "zht") {
		lockText = "鎖住";
		unlockText = "已開鎖";
	}

}



mp.events.add({
	
	"playerStartExitVehicle" : (player) => {
		if (player.vehicle.engine) {
			player.vehicle.engine = true;
		}
	},

	"playerEnterVehicle" : (player, vehicle, seat) => {
		if (seat === -1) {
			player.call("cVehicle-setFuel", [vehicle.info.fuel, vehicle.info.fuelRate, true]);
		}
	},
	
	
	"playerExitVehicle" : (player, vehicle, seat) => {
		player.call("cVehicle-setFuel", [null, 0, false]);
		setLights(player, vehicle, 0);
		
	},

	"sVehicle-SetFuel" : (player, vehicle, fuel) => {
		vehicle.info.fuel = misc.roundNum(fuel, 3);
		if (fuel <= 0.1) vehicle.engine = false;
	},

	"sKeys-Num0" : (player) => {
		if (!isDriver(player) || player.vehicle.info.fuel <= 0.1) return;
		toggleVehEngine(player.vehicle);
	},

	"sKeys-Num5" : (player) => {
		const vehicle = getNearestPlayerVehicleInRange(player, 50);
		if (!vehicle) return;
		toggleVehLock(player, vehicle);
	},

	"sKeys-Num7" : (player) => {
		toggleVehWindow(player, 0);
	},

	"sKeys-Num9" : (player) => {
		toggleVehWindow(player, 1);
	},

	"sKeys-Num4" : (player) => {
		toggleVehWindow(player, 2);
	},

	"sKeys-Num6" : (player) => {
		toggleVehWindow(player, 3);
	},
	
});
	

function isDriver(player) {
	if (!player.vehicle || player.seat !== -1) {
		return false;
	}
	return true;
}
module.exports.isDriver = isDriver;
	
function toggleVehEngine(vehicle) {
	vehicle.engine = !vehicle.engine;
}

function canOpen(player, vehicle) {
	const peopleWithKeys = vehicle.info.whoCanOpen;
	for (let i = 0; i < peopleWithKeys.length; i++) {
		if(peopleWithKeys[i] !== player.name || player.dimension !== vehicle.dimension) continue;
		return true;
	}
	return false;
}




function getNearestPlayerVehicleInRange(player, range) {
	let vehiclesInRange = [];
	mp.vehicles.forEachInRange(player.position, range, (vehicle) => {
		if (canOpen(player, vehicle)) {
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



function toggleVehLock(player, vehicle) {
	updateLanguage(player);
	if (!vehicle.locked) {
		player.notify(`${vehicle.info.title} ~r~${lockText}`);
		if (!isDriver(player)) blinkLights(vehicle);
	}
	else  {
		player.notify(`${vehicle.info.title} ~g~${unlockText}`);
		if (!isDriver(player)) {
			blinkLights(vehicle);
			setTimeout(blinkLights, 600, vehicle);
		}
	}

	vehicle.locked = !vehicle.locked;
}


function blinkLights(vehicle) {
	const engineStatus = vehicle.engine;
	if (!engineStatus) vehicle.engine = true;

	mp.players.forEach((player, id) => {
		setLights(player, vehicle, 2);
		setTimeout(setLights, 300, player, vehicle, 0);
	});

	if (!engineStatus) setTimeout(toggleVehEngine, 300, vehicle);
}

function setLights(player, vehicle, state) {
	player.call("cVehicle-setLights", [vehicle, state]);
}

function toggleVehWindow(player, window) {
	const canRoll = canRollWindow(player, window);
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

function canRollWindow(player, window) {
	if (!player.vehicle) return;
	if (isDriver(player) || player.seat + 1 === window) {
		return true;
	}
	return false;
}






















const cars = [
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

function getCarPrice(model) {
	for (let i = 0; i < cars.length; i++) {
		if (model !== cars[i].model) continue;
		return cars[i].price;
	}
	return false;
}
module.exports.getCarPrice = getCarPrice;


function getCarData(model) {
	for (let i = 0; i < cars.length; i++) {
		if (model !== cars[i].model) continue;
		return cars[i];
	}
	return false;
}

function generateRandomNumberPlate() {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let number = '';

	for (let i = 0; i < 8; i++) {
		number += possible.charAt(misc.getRandomInt(0, possible.length));
	}

	return number;
}


async function saveNewCar(player, model, coord, color = false) {
	const carData = getCarData(model);

	if (!color) color = [misc.getRandomInt(0, 255), misc.getRandomInt(0, 255), misc.getRandomInt(0, 255)];

	const d = {
		model: model,
		title: carData.title,
		fuel: carData.fuelTank,
		fuelTank: carData.fuelTank,
		fuelRate: carData.fuelRate,
		price: carData.price,
		owner: player.name,
		whoCanOpen: JSON.stringify([player.name]),
		primaryColor: JSON.stringify(color),
		secondaryColor: JSON.stringify(color),
		numberPlate: generateRandomNumberPlate(),
	}

	await misc.query(`INSERT INTO cars (model, title, fuel, fuelTank, fuelRate, price, owner, whoCanOpen, primaryColor, secondaryColor, numberPlate, coord, dim) 
		VALUES 		('${d.model}', '${d.title}', '${d.fuel}', '${d.fuelTank}', '${d.fuelRate}', '${d.price}', '${d.owner}', '${d.whoCanOpen}', 
					  '${d.primaryColor}', '${d.secondaryColor}', '${d.numberPlate}', '${coord}', 0)`);

	const car = await misc.query(`SELECT * FROM cars WHERE owner = '${player.name}' ORDER BY id DESC LIMIT 1`);
	spawnCar(car[0]);
}
module.exports.saveNewCar = saveNewCar;


function spawnCar(d) {
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
		owner: d.owner,
		whoCanOpen: whoCanOpen,
		windowsOpened: [false, false, false, false],
	}
}

async function loadPlayerVehicles(player) {
	const d = await misc.query(`SELECT * FROM cars WHERE owner = '${player.name}'`);
	for (let i = 0; i < d.length; i++) {	
		spawnCar(d[i]);
	}
}
module.exports.loadPlayerVehicles = loadPlayerVehicles;


async function savePlayerVehicles(owner) {
	const vehicles = mp.vehicles.toArray();
	for (let veh of vehicles) {
		if (!veh.info || veh.info.owner !== owner) continue;
		const coord = misc.convertOBJToJSON(veh.position, veh.rotation.z);
		await misc.query(`UPDATE cars SET coord = '${coord}', fuel = '${veh.info.fuel}', dim = '${veh.dimension}' WHERE id = '${veh.info.id}'`);
		veh.destroy();
	}
}
module.exports.savePlayerVehicles = savePlayerVehicles;


function fillUpVehicle(vehicle, litres) {
	if (!misc.isValueNumber(litres) || vehicle.info.fuel + litres > vehicle.info.fuelTank) return;
	vehicle.info.fuel += litres;
}
module.exports.fillUpVehicle = fillUpVehicle



mp.events.addCommand(
{	
	'v' : (player, fullText, model) => {  // Temporary vehicle spawning
		if (player.info.adminLvl < 1) return;
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
		vehicle.numberPlate = generateRandomNumberPlate();
	
		vehicle.info = {
			title: model,
			fuel: 50,
			fuelTank: 50,
			fuelRate: 10,
			owner: "gov",
			whoCanOpen: [player.name],
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
		vehicle.numberPlate = generateRandomNumberPlate();
	
		vehicle.info = {
			title: "Pegassi Faggio",
			fuel: 1,
			fuelTank: 5,
			fuelRate: 1.5,
			owner: "gov",
			whoCanOpen: [player.name],
			windowsOpened: [false, false, false, false],
		}

		misc.log.debug(`${player.name} spawned faggio2`);
		player.notify('Unlock: num 5');
		player.notify('Toggle engine: num 0');
	},


});       