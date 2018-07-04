"use strict"

const business = require('./sBusiness');
const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const vehicleAPI = require('../Basic/sVehicle');


let doneText, enterText, priceForLitreText, goodJourneyText, offEngineText ;
function updateLanguage(player) {
	doneText = "Done!";
	enterText = `Press ~b~E ~s~to open Gas Station Menu`;
	priceForLitreText = "Price for litre:";
	goodJourneyText = "Have a good journey!";
	offEngineText = "Please turn off the engine!"
	
	const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
		doneText = "Готово!";
		enterText = `Нажмите ~b~E ~s~для входа в меню АЗС`;
		priceForLitreText = "Цена за литр:";
		goodJourneyText = "Счастливого пути!";
		offEngineText = "Пожалуйста, заглушите двигатель!"
	}

	else if (lang === "ger") {
		doneText = "Erledigt!";
		enterText = "Drücken Sie ~b~ E ~s~, um das Tankstellenmenü zu ffnen";
		priceForLitreText = "Preis pro Liter:";
		goodJourneyText = "Gute weiter Reise!";
		offEngineText = "Bitte schalte den Motor ab!"
	}
	
	else if (lang === "br") {
		doneText = "Finalizar!";
		enterText = "Pressione ~b~ E ~s~, para abrir o menu do Posto de Gasolina";
		priceForLitreText = "Preço por litro:";
		goodJourneyText = "Tenha uma boa viagem!";
		offEngineText = "Por favor desligue o motor!"
	}
  
  else if (lang === "zh_cn") {
		doneText = "完成！";
		enterText = "按 ~b~ E ~s~打开加油菜单。";
		priceForLitreText = "每升油价:";
		goodJourneyText = "祝你旅途愉快";
		offEngineText = "请熄火！"
	}  
    
  else if (lang === "zh_tw") {
		doneText = "完成！";
		enterText = "按 ~b~ E ~s~打開加油菜單。";
		priceForLitreText = "每升油價:";
		goodJourneyText = "祝妳旅途愉快";
		offEngineText = "請熄火！"
	}

}


class gasStation extends business {
    constructor(d) {
		super(d);
		this.fuelprice = 1 + 0.02 * this.margin;
		this.fillingCoord = JSON.parse(d.fillingCoord);
		this.camData = d.camData;
		this.tempGain = 0;
    }
	
	setLocalSettings() {
		this.buyerColshape.gasStationId = this.id;
		this.blip.model = 361;
		this.blip.name = `Gas Station`;
	}

	createFillingColshape() {
		if (!this.fillingCoord) return;
		const colshape = mp.colshapes.newSphere(this.fillingCoord.x, this.fillingCoord.y, this.fillingCoord.z, this.fillingCoord.r);
		colshape.gasStationFillingId = this.id;
		this.fillingShape = colshape;
	}

	updateFuelPrice() {
		this.fuelprice = 1 + 0.02 * this.margin;
	}

	async setMargin(owner, newMargin) {
		if (this.owner !== owner || !newMargin || newMargin === this.margin) return;
		if (!misc.isValueNumber(newMargin)) return misc.log.error(`setMargin | newMargin is not a number: ${newMargin}, id: ${this.id}`);
		if (0 >  newMargin || newMargin > 200) return;
		await misc.query(`UPDATE business SET margin = ${newMargin} WHERE id = ${this.id}`);
		this.margin = newMargin;
		misc.log.debug(`${owner} sets a business №${this.id} margin: ${this.margin}`);
		this.updateFuelPrice();
	}

	getCarsCanFillUp() {
		const vehiclesList = [];
		mp.vehicles.forEachInRange(this.fillingCoord, this.fillingCoord.r, (vehicle) => {
			const obj = {
				id: vehicle.id,
				title: vehicle.info.title,
				fuel: vehicle.info.fuel,
				fuelTank: vehicle.info.fuelTank,
				numberPlate: vehicle.numberPlate,
			}
			vehiclesList.push(obj);
		});
		return vehiclesList;
	}

	async fillUpCar(player, str) {
		const carData = JSON.parse(str);

		let vehicleToFillUp;
		mp.vehicles.forEachInRange(this.fillingCoord, this.fillingCoord.r, (vehicle) => {
			if (vehicle.id === carData.id) {
				vehicleToFillUp = vehicle;
			}
		});
		if (!vehicleToFillUp) return;

		if (vehicleToFillUp.engine) {
			updateLanguage(player);
			player.notify("~r~" +offEngineText);
			return;
		}

		const price = Math.ceil(carData.litres * this.fuelprice);
		const canBuy = await moneyAPI.changeMoney(player, -price);
		if (!canBuy) return;

		const tax = misc.roundNum(price - carData.litres, 2);
		this.updateTempGain(tax);

		vehicleAPI.fillUpVehicle(vehicleToFillUp, carData.litres);
		updateLanguage(player);
		player.notify("~g~" +doneText);
		misc.log.debug(`${player.name} fill up car for $${price}`);
	}

	async updateFillingData(player, radius) {
		const pos = player.position;
		const obj = {
			x: misc.roundNum(pos.x, 3),
			y: misc.roundNum(pos.y, 3),
			z: misc.roundNum(pos.z, 3),
			r: misc.roundNum(+radius, 2),
		}
		const coord = JSON.stringify(obj);
		await misc.query(`UPDATE gasstation SET fillingCoord = '${coord}' WHERE id = ${this.id}`);
		
		updateLanguage(player);
		player.notify("~g~" +doneText);
	}

	async updateCamData(player, viewangle) {
		const pos = player.position;
		const obj = {
			x: misc.roundNum(pos.x, 3),
			y: misc.roundNum(pos.y, 3),
			z: misc.roundNum(pos.z + 2, 3),
			rz: misc.roundNum(player.heading, 2),
			viewangle: +viewangle,
		}
		const data = JSON.stringify(obj);
		await misc.query(`UPDATE gasstation SET camData = '${data}' WHERE id = ${this.id}`);
		this.camData = data;

		updateLanguage(player);
		player.notify("~g~" +doneText);
	}

	updateTempGain(newGain) {
		this.tempGain += newGain;

		if (this.tempGain < 1) return;
		const tax = Math.ceil(this.tempGain);
		this.tempGain -= tax;
		this.addMoneyToBalance(tax);
	}

}


function createShop(d) {
	const shop = new gasStation(d);
	shop.createMainEntities();
	shop.createSpecialEntities();
	shop.setLocalSettings();
	shop.createFillingColshape();
	business.addNewBusinessToList(shop);
}

async function loadShops() {
	const d = await misc.query("SELECT * FROM business INNER JOIN gasstation ON business.id = gasstation.id");
	for (let i = 0; i < d.length; i++) {
		createShop(d[i]);
	}
}
loadShops();



mp.events.add(
{
	"playerEnterColshape" : (player, colshape) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		if (!player.vehicle && colshape.gasStationId) {
			player.info.canOpen.gasStation = colshape.gasStationId;
			updateLanguage(player);
			player.notify(enterText);
		}
		else if (player.vehicle && colshape.gasStationFillingId) {
			const id = colshape.gasStationFillingId;
			const shop = business.getBusiness(id);
			updateLanguage(player);
			player.notify(`${priceForLitreText} ~g~$${shop.fuelprice}`);
		}
	},
	
	
	"playerExitColshape" : (player, colshape) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		if (colshape.gasStationId) {
			player.info.canOpen.gasStation = false;
		}
		else if (player.vehicle && colshape.gasStationFillingId) {
			updateLanguage(player);
			player.notify(goodJourneyText);
		}		
	},

	"sKeys-E" : (player) => {
		if (!player.info || !player.info.loggedIn || !player.info.canOpen.gasStation) return;
		openBuyerMenu(player);
	},

	"sGasStationFillUp" : (player, str) => {
		const id = player.info.canOpen.gasStation;
		if (!id) return;
		const shop = business.getBusiness(id);
		shop.fillUpCar(player, str);
	},

	
});



function openBuyerMenu(player) {
	const id = player.info.canOpen.gasStation;
	const shop = business.getBusiness(id);
	const cars = JSON.stringify(shop.getCarsCanFillUp());

	const str1 = `app.id = ${shop.id};`;
	const str2 = `app.margin = ${shop.margin};`;
	const str3 = `app.updatePriceForLitre();`;
	const str4 = `app.updateCars('${cars}');`

	let execute = str1 + str2 + str3 + str4;
	
	const lang = misc.getPlayerLang(player);
	player.call("cGasStationMenu", [lang, execute, shop.camData]);
	misc.log.debug(`${player.name} enter a gas station menu`);
}	


mp.events.addCommand(
{
	'creategasstation' : async (player, enteredprice) => {
		if (player.info.adminLvl < 1) return;
		const id = business.getCountOfBusinesses() + 1;
		const coord = misc.convertOBJToJSON(player.position, player.heading);
		const price = Number(enteredprice.replace(/\D+/g,""));
		const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Gas Station', '${coord}', '${price}');`);
		const query2 = misc.query(`INSERT INTO gasstation (id) VALUES ('${id}');`);	
		await Promise.all([query1, query2]);
		player.outputChatBox("!{#4caf50} Gas Station successfully created!");
		player.outputChatBox("!{#4caf50} Now do /setbusbuyermenu [id] and other commands!");
	},	

	'setgasstationfillingpos' : async (player, fullText, id, radius) => {
		if (player.info.adminLvl < 1) return;
		const shop = business.getBusiness(+id);
		shop.updateFillingData(player, radius);
	},	

	'setgasstationcamdata' : async (player, fullText, id, viewangle) => {
		if (player.info.adminLvl < 1) return;
		const shop = business.getBusiness(+id);
		shop.updateCamData(player, viewangle);
	},	

});


/* 

How to add new gas station:

1. /creategasstation [price]
Go into business table and get the latest id

2. /setbusbuyermenu [id]

Restart server

3. /setgasstationfillingpos [id] [radius]

Restart server

4. /setgasstationcamdata [id] [viewangle]

*/
