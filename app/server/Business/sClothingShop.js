"use strict"

const business = require('./sBusiness');
const misc = require('../sMisc');
const clothes = require('../Character/sClothes');
const moneyAPI = require('../Basic/sMoney');


let doneText, enterText;
function updateLanguage(player) {
	doneText = "Done!";
	enterText = `Press ~b~E ~s~to open Clothing Shop Menu`;
	
	const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
		doneText = "Готово!";
		enterText = `Нажмите ~b~E ~s~для входа в меню магазина одежды`;
	}

	else if (lang === "ger") {
		doneText = "Erledigt!";
		enterText = `Drücken Sie ~b~ E ~s~, um das Bekleidungsgeschäft zu öffnen`;
	}
	
	else if (lang === "br") {
		doneText = "Finalizar!";
		enterText = `Pressione ~b~ E ~s~, para abrir o menu da Loja de Roupas`;
	} 
  
  else if (lang === "zh_cn") {
		doneText = "完成！";
		enterText = `按 ~b~ E ~s~打开衣服店菜单`;
	} 
  
  else if (lang === "zh_tw") {
		doneText = "完成！";
		enterText = `按 ~b~ E ~s~打開衣服店菜單`;
	}

}



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

		updateLanguage(player);
		player.notify("~g~" +doneText);

		misc.log.debug(`${player.name} bought a cloth for $${endPrice}`);
	}
}

function createClothingShop(d) {
	const shop = new clothingShop(d);
	shop.createMainEntities();
	shop.createSpecialEntities();
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




mp.events.add(
{
	"playerEnterColshape" : (player, colshape) => {
		if(player.vehicle || !colshape.clothingShopId || !misc.isPlayerLoggedIn(player)) return;
		player.info.canOpen.clothingShop = colshape.clothingShopId;

		updateLanguage(player);
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

		'setchbuyerstandcoord' : async (player, id) => {
			if (player.info.adminLvl < 1) return;
			const coord = misc.convertOBJToJSON(player.position, player.heading);
			await misc.query(`UPDATE clothingshop SET buyerStandCoord = '${coord}' WHERE id = ${id}`);
			updateLanguage(player);
			player.notify("~g~" +doneText);

		},	

	}
);