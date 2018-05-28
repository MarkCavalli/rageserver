"use strict"

const business = require('./sBusiness');
const misc = require('../sMisc');
const clothes = require('../Character/sClothes');
const moneyAPI = require('../Basic/sMoney');


class clothingShop extends business {
    constructor(d) {
		super(d);
		this.buyerMenuCoord = JSON.parse(d.buyerMenuCoord);
		this.camData = JSON.parse(d.camData);
		this.buyerStandCoord = d.buyerStandCoord;
    }
	
	createSpecialEntities() {
		const pos = this.buyerMenuCoord;
		const marker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75,
		{
			color: [93, 182, 229, 25],
		});
		
		const colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 0.9);
		colshape.clothingShopId = this.id;
		
		const Blip = mp.blips.new(73, new mp.Vector3(pos.x, pos.y, pos.z),
		{	
			name: `Clothing Shop`,
			shortRange: true,
			scale: 0.7,
		});
	}

	async buyCloth(player, d) {
		const price = clothes.getPrice(player, d.title, d.number);
		const shopTax = misc.roundNum(price * this.margin / 100);
		const endPrice = price + shopTax;
		const canBuy = await moneyAPI.changeMoney(player, -endPrice);
		if (!canBuy) {
			let cantBuyText = "~r~Not enough cash!";
			if (misc.getPlayerLang(player) === "rus") cantBuyText = "~r~Недостаточно наличных!";

			return player.notify(cantBuyText);
		}
		await misc.query(`UPDATE business SET balance = balance + '${shopTax}' WHERE id = ${this.id}`);
		await clothes.saveClothes(player, d);
		this.balance += shopTax;

		let doneText = "~g~Done!";
		if (misc.getPlayerLang(player) === "rus") doneText = "~g~Готово!";
		player.notify(doneText);


		misc.log.debug(`${player.name} bought a cloth for $${endPrice}`);
	}
}

function createClothingShop(d) {
	const shop = new clothingShop(d);
	shop.createMainEntities();
	shop.createSpecialEntities();
	business.addNewBusinessToList(shop);
}


async function loadClothingShops() {
	const d = await misc.query("SELECT * FROM business INNER JOIN clothingshop ON business.id = clothingshop.id");
	for (let i = 0; i < d.length; i++) {
		createClothingShop(d[i]);
	}
}
loadClothingShops();




mp.events.add(
{
	"playerEnterColshape" : (player, colshape) => {
		if(player.vehicle || !colshape.clothingShopId || !misc.isPlayerLoggedIn(player)) return;
		player.info.canOpen.clothingShop = colshape.clothingShopId;

		let enterText = `Press ~b~E ~s~to open Clothing Shop Menu`;
		if (misc.getPlayerLang(player) === "rus") enterText = `Нажмите ~b~E ~s~для входа в меню магазина одежды`;

		player.notify(enterText);
	},
	
	"playerExitColshape" : (player, colshape) => {
		if(!colshape.clothingShopId || !misc.isPlayerLoggedIn(player)) return;
		player.info.canOpen.clothingShop = false;
	},

	"sKeys-E" : (player) => {
		if (!player.info || !player.info.loggedIn || !player.info.canOpen.clothingShop) return;
		openBuyerMenu(player);
	},

	"sClothingShopBuyCloth" : (player, data) => {
		const d = JSON.parse(data);
		const shop = business.getBusiness(d.id);
		shop.buyCloth(player, d);
	},

	"sClothingShopReloadClothes" : (player) => {
		clothes.loadPlayerClothes(player);
	},
});

function openBuyerMenu(player) {
	const id = player.info.canOpen.clothingShop;
	const shop = business.getBusiness(id);
	misc.setPlayerPosFromJSON(player, shop.buyerStandCoord);
	let cloth;
	if (player.model === 1885233650) {
		cloth = `loadMans();`;
	}
	else  {
		cloth = `loadWomans();`;
	}

	const str1 = `app.id = ${shop.id};`;
	const str2 = `app.margin = ${shop.margin};`;
	const str3 = `app.camRotation = ${shop.camData.rz - 180};`;

	let execute = str1 + str2 + str3 + cloth;
	
	const lang = misc.getPlayerLang(player);
	player.call("cClothingShopShowMenu", [lang, execute, shop.camData]);
	misc.log.debug(`${player.name} enter a clothing shop menu`);
}	


mp.events.addCommand(
	{
		'createclothingshop' : async (player, enteredprice) => {
			if (player.info.adminLvl < 1) return;
			const id = business.getCountOfBusinesses() + 1;
			const coord = misc.convertOBJToJSON(player.position, player.heading);
			const price = Number(enteredprice.replace(/\D+/g,""));
			const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Clothing Shop', '${coord}', '${price}');`);
			const query2 = misc.query(`INSERT INTO clothingshop (id) VALUES ('${id}');`);	
			await Promise.all([query1, query2]);
			player.outputChatBox("!{#4caf50} Clothing shop successfully created!");
		},	

		'setcsbmenu' : async (player, id) => {
			if (player.info.adminLvl < 1) return;
			const coord = misc.convertOBJToJSON(player.position, player.heading);
			await misc.query(`UPDATE clothingshop SET buyerMenuCoord = '${coord}' WHERE id = ${id}`);
			player.outputChatBox("!{#4caf50}Success!");
		},	
	}
);