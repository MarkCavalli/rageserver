"use strict"

const business = require('./sBusiness');
const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const vehicleAPI = require('../Basic/sVehicle');


class cheapCarDealership extends business {
    constructor(d) {
		super(d);
		this.newCarCoord = d.newCarCoord;
    }
	
	setLocalSettings() {
		this.buyerColshape.cheapCarDealershipId = this.id;
		this.blip.model = 225;
		this.blip.name = `Cheap Car Dealership`;
		this.blip.color = 31;
	}

	async buyNewCar(player, model) {
		const carPrice = vehicleAPI.getCarPrice(model);
		if (!carPrice) return;

		const shopTax = misc.roundNum(carPrice * this.margin / 400);
		const fullPrice = carPrice + shopTax;
		const canBuy = await moneyAPI.changeMoney(player, -fullPrice);
		if (!canBuy) return;

		await this.addMoneyToBalance(shopTax);
		await vehicleAPI.saveNewCar(player, model, this.newCarCoord);

		let doneText = "~g~Done!";
		if (misc.getPlayerLang(player) === "rus") doneText = "~g~Готово!";
		player.notify(doneText);

		misc.log.debug(`${player.name} bought a car ${model} for $${fullPrice}`);
	}
	
}


function createShop(d) {
	const shop = new cheapCarDealership(d);
	shop.createMainEntities();
	shop.createSpecialEntities();
	shop.setLocalSettings();
	business.addNewBusinessToList(shop);
}

async function loadShops() {
	const d = await misc.query("SELECT * FROM business INNER JOIN cheapcardealership ON business.id = cheapcardealership.id");
	for (let i = 0; i < d.length; i++) {
		createShop(d[i]);
	}
}
loadShops();


mp.events.add(
{
	"playerEnterColshape" : (player, colshape) => {
		if(player.vehicle || !colshape.cheapCarDealershipId || !misc.isPlayerLoggedIn(player)) return;
		player.info.canOpen.cheapCarDealership = colshape.cheapCarDealershipId;

		let enterText = `Press ~b~E ~s~to open Cheap Car Dealership Menu`;
		if (misc.getPlayerLang(player) === "rus") enterText = `Нажмите ~b~E ~s~для входа в меню дешевого автосалона`;

		player.notify(enterText);
	},
	
	"playerExitColshape" : (player, colshape) => {
		if(!colshape.cheapCarDealershipId || !misc.isPlayerLoggedIn(player)) return;
		player.info.canOpen.cheapCarDealership = false;
	},

	"sKeys-E" : (player) => {
		if (!player.info || !player.info.loggedIn || !player.info.canOpen.cheapCarDealership) return;
		openBuyerMenu(player);
	},

	"sCheapCarDealershipBuyCar" : (player, model, id) => {
		const shop = business.getBusiness(id);
		shop.buyNewCar(player, model);
	},


});


function openBuyerMenu(player) {
	const id = player.info.canOpen.cheapCarDealership;
	const shop = business.getBusiness(id);
	
	const str1 = `app.id = ${shop.id};`;
	const str2 = `app.margin = ${shop.margin};`;

	let execute = str1 + str2;
	
	const lang = misc.getPlayerLang(player);
	player.call("cCheapCarDealershipMenu", [lang, execute]);
	misc.log.debug(`${player.name} enter a cheap car dealership menu`);
}	


mp.events.addCommand(
{
	'createcheapcardealership' : async (player, enteredprice) => {
		if (player.info.adminLvl < 1) return;
		const id = business.getCountOfBusinesses() + 1;
		const coord = misc.convertOBJToJSON(player.position, player.heading);
		const price = Number(enteredprice.replace(/\D+/g,""));
		const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Cheap Car Dealership', '${coord}', '${price}');`);
		const query2 = misc.query(`INSERT INTO cheapcardealership (id) VALUES ('${id}');`);	
		await Promise.all([query1, query2]);
		player.outputChatBox("!{#4caf50} Cheap Car Dealership successfully created!");
	},	

	'setccardealernewcarcoord' : async (player, id) => {
		if (player.info.adminLvl < 1) return;
		if (!player.vehicle) return player.nofity(`~r~You're not in vehicle!`);
		const coord = misc.convertOBJToJSON(player.position, player.vehicle.rotation.z);
		await misc.query(`UPDATE cheapcardealership SET newCarCoord = '${coord}' WHERE id = ${id}`);
		player.notify("~g~Success!");
	},	

});