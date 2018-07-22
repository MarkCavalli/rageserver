"use strict"

const business = require('./sBusiness');
const misc = require('../sMisc');
const clothes = require('../Character/sClothes');
const moneyAPI = require('../Basic/sMoney');
const i18n = require('../sI18n');


class clothingShop extends business {
    constructor(d) {
		super(d);
		this.camData = JSON.parse(d.camData);
		this.buyerStandCoord = d.buyerStandCoord;
    }
	
	setLocalSettings() {
		this.buyerColshape.clothingShopId = this.id;
		this.blip.model = 73;
		this.blip.name = `Clothing shop`;
	}

	async buyCloth(player, d) {
		const price = clothes.getPrice(player, d.title, d.number);
		const shopTax = misc.roundNum(price * this.margin / 100);
		const endPrice = price + shopTax;
		const canBuy = await moneyAPI.changeMoney(player, -endPrice);
		if (!canBuy) return;

		await this.addMoneyToBalance(shopTax);
		await clothes.saveClothes(player, d);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
		misc.log.debug(`${player.name} bought a cloth for $${endPrice}`);
	}

	async updateCamData(player) {
		const pos = player.position;
		const obj = {
			x: misc.roundNum(pos.x, 2),
			y: misc.roundNum(pos.y, 2),
			z: misc.roundNum(pos.z, 2),
			rz: misc.roundNum(player.heading, 2),
			viewangle: 35,
		}
		const data = JSON.stringify(obj);
		await misc.query(`UPDATE clothingshop SET camData = '${data}' WHERE id = ${this.id}`);
		this.camData = obj;

		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	}

	
	openBuyerMenu(player) {
		if (player.vehicle) return;
		misc.setPlayerPosFromJSON(player, this.buyerStandCoord);
		let cloth;
		if (player.model === 1885233650) cloth = `loadMans();`;
		else cloth = `loadWomans();`;

		const str1 = `app.id = ${this.id};`;
		const str2 = `app.margin = ${this.margin};`;
		const str3 = `app.camRotation = ${this.camData.rz - 180};`;

		let execute = str1 + str2 + str3 + cloth;
	
		player.call("cClothingShop-ShowBuyerMenu", [player.lang, execute, this.camData]);
		misc.log.debug(`${player.name} enter a clothing shop menu`);
	}	
}


function createClothingShop(d) {
	const shop = new clothingShop(d);
	shop.createMainEntities();
	shop.createBuyerEntities();
	shop.setLocalSettings();
	business.addNewBusinessToList(shop);
}

async function loadClothingShops() {
	const d = await misc.query("SELECT * FROM business INNER JOIN clothingshop ON business.id = clothingshop.id");
	for (let i = 0; i < d.length; i++) {
		createClothingShop(d[i]);
	}
}
loadClothingShops();

mp.events.add({
	"sClothingShop-BuyCloth" : (player, data) => {
		const d = JSON.parse(data);
		const shop = business.getBusiness(d.id);
		shop.buyCloth(player, d);
	},

	"sClothingShop-ReloadClothes" : (player) => {
		clothes.loadPlayerClothes(player);
	},
});

mp.events.addCommand({
	'createclothingshop' : async (player, enteredprice) => {
		if (misc.getAdminLvl(player) < 1) return;
		const id = business.getCountOfBusinesses() + 1;
		const coord = misc.convertOBJToJSON(player.position, player.heading);
		const price = Number(enteredprice.replace(/\D+/g,""));
		const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Clothing Shop', '${coord}', '${price}');`);
		const query2 = misc.query(`INSERT INTO clothingshop (id) VALUES ('${id}');`);	
		await Promise.all([query1, query2]);
		player.outputChatBox("!{#4caf50} Clothing shop successfully created!");
	},	

	'setchbuyerstandcoord' : async (player, id) => {
		if (misc.getAdminLvl(player) < 1) return;
		const coord = misc.convertOBJToJSON(player.position, player.heading);
		await misc.query(`UPDATE clothingshop SET buyerStandCoord = '${coord}' WHERE id = ${id}`);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	},

	'setchcamdata' : async (player, fullText, id) => {
		if (misc.getAdminLvl(player) < 1) return;
		const shop = business.getBusiness(+id);
		shop.updateCamData(player);
	},	

});
