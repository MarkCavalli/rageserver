
const misc = require('../sMisc');
const i18n = require('../sI18n');
const moneySingletone = require('../Basic/Money/sMoney');


const businessList = [];

class business {
	constructor(d) {
		this.id = d.id;
		this.title = d.title;
		this.coord = JSON.parse(d.coord);
		this.price = d.price;
		this.ownerId = d.ownerId;
		this.margin = d.margin;
		this.balance = d.balance;
		this.buyerMenuCoord = JSON.parse(d.buyerMenuCoord);
		this.updateOwner();

		businessList.push(this);
		this.createMainEntities();
		this.createBuyerEntities();
		this.setLocalSettings();
	}

	createMainEntities() {
		this.colshape = mp.colshapes.newSphere(this.coord.x, this.coord.y, this.coord.z, 0.5);
		this.colshape.businessId = this.id;

		this.marker = mp.markers.new(1, new mp.Vector3(this.coord.x, this.coord.y, this.coord.z - 1), 0.75);
		this.updateMarker();
	}

	updateMarker() {
		if (!this.ownerId) {
			return this.marker.setColor(50, 250, 50, 25);
		}
		this.marker.setColor(250, 250, 50, 25);
	}

	createBuyerEntities() {
		const pos = this.buyerMenuCoord;
		mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75,
		{
			color: [93, 182, 229, 25],
		});
		
		this.buyerColshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 0.9);
		this.buyerColshape.businessBuyerId = this.id;
		this.blip = mp.blips.new(106, new mp.Vector3(pos.x, pos.y, pos.z),
		{	
			shortRange: true,
			scale: 0.7,
		});
	}

	async updateOwner() {
		if (this.ownerId) {
			await misc.query(`UPDATE business SET ownerId = '${this.ownerId}' WHERE id = ${this.id} LIMIT 1`);
			const d = await misc.query(`SELECT firstName, lastName from users WHERE id = '${this.ownerId}' LIMIT 1`);
			this.owner = `${d[0].firstName} ${d[0].lastName}`;
		}
		else {
			await misc.query(`UPDATE business SET ownerId = '0' WHERE id = ${this.id} LIMIT 1`);
			this.ownerId = 0;
			this.owner = ``;
		}
	}

	isPlayerHasBusiness(id) {
		for (let i = 0; i < businessList.length; i++) {
			if (businessList[i].ownerId === id) {
				return true;
			}
		}
		return false;
	}

	async buyBusiness(player) {
		if (this.ownerId) return;
		if (this.isPlayerHasBusiness(player.guid)) return player.notify(`~r~${i18n.get('sBusiness', 'alreadyHave', player.lang)}!`);
		const canBuy = await player.changeMoney(-this.price);
		if (!canBuy) return;
		this.ownerId = player.guid;
		misc.log.debug(`${player.name} bought a businnes №${this.id}`);
		this.updateMarker();
		await this.updateOwner();
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	}
	
	async sellBusiness(ownerId) {
		if (this.ownerId !== ownerId) return;
		this.ownerId = 0;
		const d = await misc.query(`SELECT lang from users WHERE id = '${ownerId}' LIMIT 1`);
		const owner = misc.getPlayerByGuid(ownerId);
		if (!owner) {
			await moneySingletone.addBankMoneyOffline(ownerId, this.price * 0.5);
		}
		else {
			await owner.addBankMoney(this.price * 0.5, `${i18n.get('sBusiness', 'sale', `${d[0].lang}`)}`);
		}
		misc.log.debug(`${ownerId} sold a businnes №${this.id}`);
		this.updateMarker();
		await this.updateOwner();
	}

	async takeBalanceMoney(player) {
		if (this.ownerId !== player.guid || this.balance === 0) return;
		await misc.query(`UPDATE business SET balance = 0 WHERE id = ${this.id} LIMIT 1`);
		await player.changeMoney(+this.balance);
		this.balance = 0;
		misc.log.debug(`${player.name} takes a business №${this.id} balance: $${this.balance}`);
	}

	addMoneyToBalance(value) {
		if (typeof value !== "number") return misc.log.error(`addMoneyToBalance | value is not a number: ${value}, id: ${this.id}`);
		misc.query(`UPDATE business SET balance = balance + ${value} WHERE id = ${this.id}`);
		this.balance += value;
	}
	
	async setMargin(ownerId, newMargin) {
		if (this.ownerId !== ownerId || newMargin === this.margin) return;
		if (!misc.isValueNumber(newMargin)) return misc.log.error(`setMargin | newMargin is not a number: ${newMargin}, id: ${this.id}`);
		if (newMargin <  0 || newMargin > 200) return;
		await misc.query(`UPDATE business SET margin = ${newMargin} WHERE id = ${this.id} LIMIT 1`);
		this.margin = newMargin;
		misc.log.debug(`${this.owner} sets a business №${this.id} margin: ${this.margin}`);
	}

	async payTaxes() {
		if (!this.ownerId) return;
		const owner = misc.getPlayerByGuid(this.ownerId);
		let isTaxSuccess;
		if (!owner) isTaxSuccess = await moneySingletone.payTaxOffline(this.ownerId, this.price / 10000);
		else isTaxSuccess = await owner.payTax(this.price / 10000, `${this.title}`);
		if (isTaxSuccess) return;
		this.sellBusiness(this.ownerId);
	}

	openBusinessMenu(player) {
		let execute = `app.id = ${this.id};`;
		execute += `app.title = '${this.title}';`;
		execute += `app.price = ${this.price};`;
		execute += `app.owner = '${this.owner}';`;
		execute += `setTimeout(load, 300);`; // For add transition effect
	
		if (this.ownerId === player.guid) {
			execute += `app.balance = ${this.balance};`;
			execute += `app.margin = ${this.margin};`;
			execute += `app.loadForOwner();`;
		}
		else if (!this.ownerId) {
			execute += `app.loadForSale();`;
		}
		
		player.call("cBusinnes-ShowMenu", [player.lang, execute]);
		misc.log.debug(`${player.name} enters Business Menu`);
	}
}
module.exports = business;


function getBusiness(id) {
	for (let i = 0; i < businessList.length; i++) {
		if (businessList[i].id === id) return businessList[i];
	}
}
module.exports.getBusiness = getBusiness;


function getCurrentBusiness(player) {
	if (!player.canOpen.business) return false;
	return getBusiness(player.canOpen.business);
}


mp.events.add({
	"playerEnterColshape" : (player, shape) => {
		if (!player.loggedIn) return;
		if (!shape.businessId && !shape.businessBuyerId) return;
		if (shape.businessId && !player.vehicle) player.canOpen.business = shape.businessId;
		else if (shape.businessBuyerId) player.canOpen.businessBuyerMenu = shape.businessBuyerId;
		player.notify(`${i18n.get('basic', 'pressEToOpenMenu', player.lang)}`);
	},
	
	"playerExitColshape" : (player, shape) => {
		if (!player.loggedIn) return;
		if (!shape.businessId && !shape.businessBuyerId) return;
		if (shape.businessId) player.canOpen.business = false;
		else if (shape.businessBuyerId) player.canOpen.businessBuyerMenu = false;	
	},

	"sKeys-E" : (player) => {
		if (!player.loggedIn) return;
		if (player.canOpen.business && !player.vehicle) {
			const bus = getBusiness(player.canOpen.business);
			bus.openBusinessMenu(player);
		}
		else if (player.canOpen.businessBuyerMenu) {
			const bus = getBusiness(player.canOpen.businessBuyerMenu);
			bus.openBuyerMenu(player);
		}
	},

	"sBusiness-BuyBusiness" : (player) => {
		const bus = getCurrentBusiness(player);
		if (bus) bus.buyBusiness(player);
	},

	"sBusiness-SellBusiness" : (player) => {
		const bus = getCurrentBusiness(player);
		if (bus) bus.sellBusiness(player.guid);
	},

	"sBusiness-TakeBalanceMoney" : (player) => {
		const bus = getCurrentBusiness(player);
		if (bus) bus.takeBalanceMoney(player);
	},

	"sBusiness-ChangeMargin" : (player, margin) => {
		const bus = getCurrentBusiness(player);
		if (bus) bus.setMargin(player.guid, margin);
	},
});


function payTaxes() {
	for (let i = 0; i < businessList.length; i++) {
		businessList[i].payTaxes();
	}
}
module.exports.payTaxes = payTaxes;


function getCountOfBusinesses() {
	return businessList.length;
}
module.exports.getCountOfBusinesses = getCountOfBusinesses;

mp.events.addCommand({
	'setbusbuyermenu' : async (player, id) => {
		if (player.adminlvl < 1) return;
		const coord = misc.getPlayerCoordJSON(player);
		await misc.query(`UPDATE business SET buyerMenuCoord = '${coord}' WHERE id = ${id}`);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	},	
});


function getNearestBusiness(name, playerPosition) {
	let nearestBus;
	for (const bus of businessList) {
		if (bus.title === name) {
			nearestBus = bus;
			break;
		}
	}
	for (const bus of businessList) {
		if (bus.title !== name) continue;
		if (bus.blip.dist(playerPosition) < nearestBus.blip.dist(playerPosition)) {
			nearestBus = bus;
		}
	}
	return nearestBus.blip.position;
}
module.exports.getNearestBusiness = getNearestBusiness;

function getBusinessPositionById(id) {
	const bus = getBusiness(id);
	if (!bus) return false;
	return bus.blip.position;	
}
module.exports.getBusinessPositionById = getBusinessPositionById;


