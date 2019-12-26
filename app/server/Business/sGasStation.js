const business = require('./sBusiness');
const misc = require('../sMisc');
const i18n = require('../sI18n');



class GasStation extends business {
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

	async setMargin(ownerId, newMargin) {
		await super.setMargin(ownerId, newMargin);
		this.updateFuelPrice();
	}

	getCarsCanFillUp() {
		const vehiclesList = [];
		mp.vehicles.forEachInRange(this.fillingCoord, this.fillingCoord.r, (vehicle) => {
			const obj = {
				id: vehicle.id,
				title: vehicle.title,
				fuel: vehicle.fuel,
				fuelTank: vehicle.fuelTank,
				numberPlate: vehicle.numberPlate,
			}
			vehiclesList.push(obj);
		});
		return vehiclesList;
	}

	async fillUpCar(player, str) {
		const carData = JSON.parse(str);

		let vehicle;
		mp.vehicles.forEachInRange(this.fillingCoord, this.fillingCoord.r, (veh) => {
			if (veh.id === carData.id) {
				vehicle = veh;
			}
		});
		if (!vehicle) return;

		if (vehicle.engine) {
			player.notify(`~r~${i18n.get('sGasStation', 'offEngine', player.lang)}!`);
			return;
		}
		if (vehicle.getOccupants().length > 0) {
			player.notify(`~r~${i18n.get('sGasStation', 'passengersDropOff', player.lang)}!`);
			return;
		}

		const price = Math.ceil(carData.litres * this.fuelprice);
		const canBuy = await player.changeMoney(-price);
		if (!canBuy) return;

		const tax = misc.roundNum(price - carData.litres, 2);
		this.updateTempGain(tax);
		vehicle.fillUp(carData.litres);

		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
		misc.log.debug(`${player.name} fill up car for $${price}`);
	}

	async updateFillingData(player, radius) {
		const pos = player.position;
		const obj = {
			x: misc.roundNum(pos.x, 2),
			y: misc.roundNum(pos.y, 2),
			z: misc.roundNum(pos.z, 2),
			r: misc.roundNum(+radius, 2),
		}
		const coord = JSON.stringify(obj);
		await misc.query(`UPDATE gasstation SET fillingCoord = '${coord}' WHERE id = ${this.id}`);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	}

	async updateCamData(player, viewangle) {
		const pos = player.position;
		const obj = {
			x: misc.roundNum(pos.x, 2),
			y: misc.roundNum(pos.y, 2),
			z: misc.roundNum(pos.z + 2, 2),
			rz: misc.roundNum(player.heading, 2),
			viewangle: +viewangle,
		}
		const data = JSON.stringify(obj);
		await misc.query(`UPDATE gasstation SET camData = '${data}' WHERE id = ${this.id}`);
		this.camData = data;

		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	}

	updateTempGain(newGain) {
		this.tempGain += newGain;
		if (this.tempGain < 1) return;
		const tax = Math.ceil(this.tempGain);
		this.tempGain -= tax;
		this.addMoneyToBalance(tax);
	}

	openBuyerMenu(player) {
		if (player.vehicle) return;
		const cars = JSON.stringify(this.getCarsCanFillUp());
	
		let execute = `app.id = ${this.id};`;
		execute += `app.margin = ${this.margin};`;
		execute += `app.updatePriceForLitre();`;
		execute += `app.updateCars('${cars}');`
		
		player.call("cGasStation-OpenBuyerMenu", [player.lang, execute, this.camData]);
		misc.log.debug(`${player.name} enter a gas station menu`);
	}	

}

mp.events.add({
	"playerEnterColshape" : (player, colshape) => {
		if (!player.loggedIn) return;
		if (player.vehicle && colshape.gasStationFillingId) {
			const shop = business.getBusiness(colshape.gasStationFillingId);
			player.notify(`${i18n.get('sGasStation', 'fuelPrice', player.lang)}: ~g~$${shop.fuelprice}`);
		}
	},
	
	"playerExitColshape" : (player, colshape) => {
		if (!player.loggedIn) return;
		if (player.vehicle && colshape.gasStationFillingId) player.notify(`~g~${i18n.get('sGasStation', 'goodJourney', player.lang)}`);
	},

	"sGasStation-FillUp" : (player, str) => {
		const id = player.canOpen.businessBuyerMenu;
		if (!id) return;
		const shop = business.getBusiness(id);
		shop.fillUpCar(player, str);
	},
});


async function loadShops() {
	const d = await misc.query("SELECT * FROM business INNER JOIN gasstation ON business.id = gasstation.id");
	for (let i = 0; i < d.length; i++) {
		const shop = new GasStation(d[i]);
		shop.createFillingColshape();
	}
}
loadShops();


mp.events.addCommand({
	'creategasstation' : async (player, enteredprice) => {
		if (player.adminlvl < 1) return;
		const id = business.getCountOfBusinesses() + 1;
		const coord = misc.getPlayerCoordJSON(player);
		const price = Number(enteredprice.replace(/\D+/g,""));
		const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Gas Station', '${coord}', '${price}');`);
		const query2 = misc.query(`INSERT INTO gasstation (id) VALUES ('${id}');`);	
		await Promise.all([query1, query2]);
		player.outputChatBox("!{#4caf50} Gas Station successfully created!");
	},	

	'setgasstationfillingpos' : async (player, fullText, id, radius) => {
		if (player.adminlvl < 1) return;
		const shop = business.getBusiness(+id);
		shop.updateFillingData(player, radius);
	},	

	'setgasstationcamdata' : async (player, fullText, id, viewangle) => {
		if (player.adminlvl < 1) return;
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

4. /setgasstationcamdata [id] [viewangle]

*/