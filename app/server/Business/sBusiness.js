"use strict"

const misc = require('../sMisc');
const i18n = require('../sI18n');
const money = require('../Basic/sMoney');


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
			await misc.query(`UPDATE business SET ownerId = '${this.ownerId}' WHERE id = ${this.id}`);
			const d = await misc.query(`SELECT firstName, lastName from users WHERE id = '${this.ownerId}'`);
			this.owner = `${d[0].firstName} ${d[0].lastName}`;
		}
		else {
			await misc.query(`UPDATE business SET ownerId = '0' WHERE id = ${this.id}`);
			this.ownerId = 0;
			this.owner = ``;
		}
	}

	async buyBusiness(player) {
		if (this.ownerId) return;
		if (isPlayerHasBusiness(player.basic.id)) return player.notify(`~r~${i18n.get('sBusiness', 'alreadyHave', player.lang)}!`);
		const canBuy = await money.changeMoney(player, -this.price);
		if (!canBuy) return;
		this.ownerId = player.basic.id;
		misc.log.debug(`${player.name} bought a businnes №${this.id}`);
		this.updateMarker();
		await this.updateOwner();
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	}
	
	async sellBusiness(ownerId) {
		if (this.ownerId !== ownerId) return;
		this.ownerId = 0;
		money.addToBankMoney(ownerId, this.price * 0.5, `${i18n.get('sBusiness', 'sale', 'eng')}`)
		misc.log.debug(`${ownerId} sold a businnes №${this.id}`);
		this.updateMarker();
		await this.updateOwner();
	}

	async takeBalanceMoney(player) {
		if (this.ownerId !== player.basic.id || this.balance === 0) return;
		await misc.query(`UPDATE business SET balance = 0 WHERE id = ${this.id}`);
		await money.changeMoney(player, +this.balance);
		misc.log.debug(`${player.name} takes a business №${this.id} balance: $${this.balance}`);
		this.balance = 0;
	}

	addMoneyToBalance(value) {
		if (typeof value !== "number") return misc.log.error(`addMoneyToBalance | value is not a number: ${value}, id: ${this.id}`);
		misc.query(`UPDATE business SET balance = balance + ${value} WHERE id = ${this.id}`);
		this.balance += value;
	}
	
	async setMargin(ownerId, newMargin) {
		if (this.ownerId !== ownerId || newMargin === this.margin) return;
		if (!misc.isValueNumber(newMargin)) return misc.log.error(`setMargin | newMargin is not a number: ${newMargin}, id: ${this.id}`);
		if (0 >  newMargin || newMargin > 200) return;
		await misc.query(`UPDATE business SET margin = ${newMargin} WHERE id = ${this.id}`);
		this.margin = newMargin;
		misc.log.debug(`${this.owner} sets a business №${this.id} margin: ${this.margin}`);
	}

	async payTaxes() {
		if (!this.ownerId) return;
		const isTaxSuccess = await money.payTaxOffline(this.ownerId, this.price / 10000, `${this.title}`);
		if (isTaxSuccess) return;
		this.sellBusiness(this.ownerId);
	}

	openBusinessMenu(player) {
		const str1 = `app.id = ${this.id};`;
		const str2 = `app.title = '${this.title}';`;
		const str3 = `app.price = ${this.price};`;
		const str4 = `app.owner = '${this.owner}';`;
		const str5 = `setTimeout(load, 300);`; // For add transition effect
	
		const str6 = `app.balance = ${this.balance};`;
		const str7 = `app.margin = ${this.margin};`;
		const str8 = `app.loadForOwner();`;
		const str9 = `app.loadForSale();`;
	
		let execute = str1 + str2 + str3 + str4 + str5;
		if (this.ownerId === player.basic.id) execute += str6 + str7 + str8;
		else if (!this.ownerId) execute += str9;
		
		player.call("cBusinnes-ShowMenu", [player.lang, execute]);
		misc.log.debug(`${player.name} enters Business Menu`);
	}
}
module.exports = business;



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
			const business = getBusiness(player.canOpen.business);
			business.openBusinessMenu(player);
		}
		else if (player.canOpen.businessBuyerMenu) {
			const business = getBusiness(player.canOpen.businessBuyerMenu);
			business.openBuyerMenu(player);
		}
	},

	"sBusiness-BuyBusiness" : (player) => {
		const business = getCurrentBusiness(player);
		if (business) business.buyBusiness(player);
	},

	"sBusiness-SellBusiness" : (player) => {
		const business = getCurrentBusiness(player);
		if (business) business.sellBusiness(player.basic.id);
	},

	"sBusiness-TakeBalanceMoney" : (player) => {
		const business = getCurrentBusiness(player);
		if (business) business.takeBalanceMoney(player);
	},

	"sBusiness-ChangeMargin" : (player, margin) => {
		const business = getCurrentBusiness(player);
		if (business) business.setMargin(player.basic.id, margin);
	},
});


function isPlayerHasBusiness(id) {
	for (let i = 0; i < businessList.length; i++) {
		if (businessList[i].ownerId === id) {
			return true;
		}
	}
	return false;
}

function payTaxes() {
	for (let i = 0; i < businessList.length; i++) {
		businessList[i].payTaxes();
	}
}
module.exports.payTaxes = payTaxes;

function addNewBusinessToList(business) {
	businessList.push(business);
}
module.exports.addNewBusinessToList = addNewBusinessToList;

function getBusiness(id) {
	for (let i = 0; i < businessList.length; i++) {
		if (businessList[i].id === id) {
			return businessList[i];
		}
	}
}
module.exports.getBusiness = getBusiness;

function getCountOfBusinesses() {
	return businessList.length;
}
module.exports.getCountOfBusinesses = getCountOfBusinesses;

function getCurrentBusiness(player) {
	if (!player.canOpen.business) return;
	const id = player.canOpen.business;
	return getBusiness(id);
}

mp.events.addCommand({
	'setbusbuyermenu' : async (player, id) => {
		if (misc.getAdminLvl(player) < 1) return;
		const coord = misc.convertOBJToJSON(player.position, player.heading);
		await misc.query(`UPDATE business SET buyerMenuCoord = '${coord}' WHERE id = ${id}`);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
	},	
});