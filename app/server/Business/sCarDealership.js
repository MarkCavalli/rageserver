
const business = require('./sBusiness');
const misc = require('../sMisc');
const vehicleSingletone = require('../Basic/Vehicles/sVehicleSingletone');
const vehiclesDataSingleton = require('../Basic/Vehicles/sVehiclesData');
const i18n = require('../sI18n');



class CarDealership extends business {
    constructor(d) {
		super(d);
		this.newCarCoord = d.newCarCoord;
    }

	async buyNewCar(player, model) {
		const carPrice = vehiclesDataSingleton.getPrice(model);
		if (!carPrice) return;
		const shopTax = misc.roundNum(carPrice * this.margin / 400);
		const fullPrice = carPrice + shopTax;
		const canBuy = await player.changeMoney(-fullPrice);
		if (!canBuy) return;
		await this.addMoneyToBalance(shopTax);
		await vehicleSingletone.saveNewCar(player, model, this.newCarCoord);

		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}`);
		misc.log.debug(`${player.name} bought a car ${model} for $${fullPrice}`);
	}
	
}
module.exports = CarDealership;

mp.events.add({
	"sCarDealership-BuyCar" : (player, str) => {
		const d = JSON.parse(str);
		const shop = business.getBusiness(d.id);
		shop.buyNewCar(player, d.model);
	},
});