"use strict"

const business = require('./sBusiness');
const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const vehicleAPI = require('../Basic/sVehicle');
const i18n = require('../sI18n');



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

		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}`);
		misc.log.debug(`${player.name} bought a car ${model} for $${fullPrice}`);
	}

	openBuyerMenu(player) {
		if (player.vehicle) return;
		const str1 = `app.id = ${this.id};`;
		const str2 = `app.margin = ${this.margin};`;

		let execute = str1 + str2;
		
		player.call("cCheapCarDealership-OpenBuyerMenu", [player.lang, execute]);
		misc.log.debug(`${player.name} enter a cheap car dealership menu`);
	}
	
}

mp.events.add({
	"sCheapCarDealership-BuyCar" : (player, str) => {
		const d = JSON.parse(str);
		const shop = business.getBusiness(d.id);
		shop.buyNewCar(player, d.model);
	},
});


mp.events.addCommand({
	'createcheapcardealership' : async (player, enteredprice) => {
		if (misc.getAdminLvl(player) < 1) return;
		const id = business.getCountOfBusinesses() + 1;
		const coord = misc.convertOBJToJSON(player.position, player.heading);
		const price = Number(enteredprice.replace(/\D+/g,""));
		const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Cheap Car Dealership', '${coord}', '${price}');`);
		const query2 = misc.query(`INSERT INTO cheapcardealership (id) VALUES ('${id}');`);	
		await Promise.all([query1, query2]);
		player.outputChatBox("!{#4caf50} Cheap Car Dealership successfully created!");
		player.outputChatBox("!{#4caf50} Now do /setbusbuyermenu [id] and other commands!");
	},	

	'setccardealernewcarcoord' : async (player, id) => {
		if (misc.getAdminLvl(player) < 1) return;
		if (!player.vehicle) return player.nofity(`~r~You're not in vehicle!`);
		const coord = misc.convertOBJToJSON(player.position, player.vehicle.rotation.z);
		await misc.query(`UPDATE cheapcardealership SET newCarCoord = '${coord}' WHERE id = ${id}`);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}`);

	},	

});


function createShop(d) {
	const shop = new cheapCarDealership(d);
	shop.createMainEntities();
	shop.createBuyerEntities();
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