"use strict"

const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');

let ownText, boughtText, taxText , enterText, doneText;
function updateLanguage(player) {
	ownText = "You can't own more than 1 business!";
	boughtText = "You bought a business!";
	taxText = "Tax for business №";
	enterText = `Press ~b~E ~s~to open Business Menu`;

	const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
		ownText = "Вы не можете иметь более 1 бизнеса!";
		boughtText = "Вы купили бизнес!";
		taxText = "Налог за бизнес №";
		enterText = `Нажмите ~b~E ~s~для входа в меню бизнеса`;
		doneText = "Готово!";
	}

	else if (lang === "ger") {
		ownText = "Sie können nicht mehr als 1 Geschäft besitzen!";
		boughtText = "Du hast ein Geschäft gekauft!";
		taxText = "Steuern für Geschäft №";
		enterText = `Drücken Sie ~b~ E ~s~, um das Business-Menü zu öffnen`;
		doneText = "Erledigt!";
	}
	
	else if (lang === "br") {
		ownText = "Você não pode possuir mais de 1 negócio!";
		boughtText = "Você comprou um negócio!";
		taxText = "Imposto para negócios №";
		enterText = `Pressione ~b~ E ~s~, para abrir o menu de Negócios`;
		doneText = "Finalizar!";
	}

}



const businessList = [];

class business {
	constructor(d) {
		this.id = d.id;
		this.title = d.title;
		this.coord = JSON.parse(d.coord);
		this.price = d.price;
		this.owner = d.owner;
		this.margin = d.margin;
		this.balance = d.balance;
		this.buyerMenuCoord = JSON.parse(d.buyerMenuCoord);
	}

	createMainEntities() {
		const colshape = mp.colshapes.newSphere(this.coord.x, this.coord.y, this.coord.z, 0.5);
		colshape.businessId = this.id;
		this.colshape = colshape;

		const marker = mp.markers.new(1, new mp.Vector3(this.coord.x, this.coord.y, this.coord.z - 1), 0.75);
		this.marker = marker;
		this.updateMarker();
	}

	updateMarker() {
		if (!this.owner) {
			return this.marker.setColor(50, 250, 50, 25);
		}
		this.marker.setColor(250, 250, 50, 25);
	}

	createSpecialEntities() {
		const pos = this.buyerMenuCoord;
		const buyerMarker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75,
		{
			color: [93, 182, 229, 25],
		});
		
		const buyerColshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 0.9);
		this.buyerColshape = buyerColshape;
		
		const blip = mp.blips.new(106, new mp.Vector3(pos.x, pos.y, pos.z),
		{	
			shortRange: true,
			scale: 0.7,
		});
		this.blip = blip;
	}

	async buyBusiness(player) {
		if (this.owner) return;
		if (player.info.hasBusiness) {
			updateLanguage(player);
			return player.notify("~r~" +ownText);
		}
		const canBuy = await moneyAPI.changeMoney(player, -this.price);
		if (!canBuy) return;
		const query1 = misc.query(`UPDATE business SET owner = '${player.name}' WHERE id = ${this.id}`);
		const query2 = misc.query(`UPDATE users SET hasBusiness = '1' WHERE username = '${player.name}'`);
		await Promise.all([query1, query2]);
		this.owner = player.name;
		player.info.hasBusiness = 1;
		
		misc.log.debug(`${player.name} bought a businnes №${this.id}`);
		this.updateMarker();

		updateLanguage(player);
		player.notify("~g~" +boughtText);
	}
	
	async sellBusiness(owner) {
		if (this.owner !== owner) return;
		const query1 = misc.query(`UPDATE business SET owner = null WHERE id = ${this.id}`);
		const query2 = misc.query(`UPDATE users SET hasBusiness = '0' WHERE username = '${owner}'`);
		await Promise.all([query1, query2]);
		this.owner = null;

		moneyAPI.addToBankMoneyOffline(owner, this.price * 0.5, "Sell business");
		for (let j = 0; j < mp.players.length; j++) {
			const player = mp.players.at(j);
			if (player.name === owner) {
				player.info.hasBusiness = 0;
				break;
			}
		}
		misc.log.debug(`${owner} sold a businnes №${this.id}`);
		this.updateMarker();
	}

	async takeBalanceMoney(player) {
		if (this.owner !== player.name || this.balance === 0) return;
		await misc.query(`UPDATE business SET balance = 0 WHERE id = ${this.id}`);
		await moneyAPI.changeMoney(player, +this.balance);
		misc.log.debug(`${this.owner} takes a business №${this.id} balance: ${this.balance}`);
		this.balance = 0;
	}

	addMoneyToBalance(value) {
		if (typeof value !== "number") return misc.log.error(`addMoneyToBalance | value is not a number: ${value}, id: ${this.id}`);
		misc.query(`UPDATE business SET balance = balance + ${value} WHERE id = ${this.id}`);
		this.balance += value;
	}
	
	async setMargin(owner, newMargin) {
		if (this.owner !== owner || !newMargin || newMargin === this.margin) return;
		if (!misc.isValueNumber(newMargin)) return misc.log.error(`setMargin | newMargin is not a number: ${newMargin}, id: ${this.id}`);
		if (0 >  newMargin || newMargin > 200) return;
		await misc.query(`UPDATE business SET margin = ${newMargin} WHERE id = ${this.id}`);
		this.margin = newMargin;
		misc.log.debug(`${owner} sets a business №${this.id} margin: ${this.margin}`);
	}

	async payTaxes() {
		if (!this.owner) return;

		updateLanguage(player);

		const isTaxSuccess = await moneyAPI.payTaxOffline(this.owner, this.price / 10000, `${taxText}${this.id}`);
		if (isTaxSuccess) return;
		this.sellBusiness(this.owner);
	}
}
module.exports = business;


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



mp.events.add(
{
	"playerEnterColshape" : (player, colshape) => {
		if(player.vehicle || !colshape.businessId || !misc.isPlayerLoggedIn(player)) return;
		player.info.canOpen.business = colshape.businessId;

		updateLanguage(player);
		player.notify(enterText);
	},
	
	"playerExitColshape" : (player, colshape) => {
		if(!misc.isPlayerLoggedIn(player) || !colshape.businessId) return;
		player.info.canOpen.business = false;
	},

	"sKeys-E" : (player) => {
		if (!misc.isPlayerLoggedIn(player)) return;
		openBusinessMenu(player);
	},

	"sBuyBusiness" : (player) => {
		const business = getCurrentBusiness(player);
		if (!business) return;
		business.buyBusiness(player);
	},

	"sSellBusiness" : (player) => {
		const business = getCurrentBusiness(player);
		if (!business) return;
		business.sellBusiness(player.name);
	},

	"sBusinessTakeBalanceMoney" : (player) => {
		const business = getCurrentBusiness(player);
		if (!business) return;
		business.takeBalanceMoney(player);
	},

	"sBusinessChangeMargin" : (player, margin) => {
		const business = getCurrentBusiness(player);
		if (!business) return;
		business.setMargin(player.name, margin);
	},
});

function openBusinessMenu(player) {
	if (!player.info.canOpen.business) return;
	const business = getBusiness(player.info.canOpen.business);
	const str1 = `app.id = ${business.id};`;
	const str2 = `app.title = '${business.title}';`;
	const str3 = `app.price = ${business.price};`;
	const str4 = `app.owner = '${business.owner}';`;
	const str5 = `setTimeout(load, 300);`; // For add transition effect

	const str6 = `app.balance = ${business.balance};`;
	const str7 = `app.margin = ${business.margin};`;
	const str8 = `app.loadForOwner();`;
	const str9 = `app.loadForSale();`;

	let execute = str1 + str2 + str3 + str4 + str5;
	if (business.owner === player.name) {
		execute += str6 + str7 + str8;
	}
	else if (!business.owner) {
		execute += str9;
	}
	
	const lang = misc.getPlayerLang(player);
	player.call("cBusinnesShowMenu", [lang, execute]);
	misc.log.debug(`${player.name} enters Business Menu`);
}

function getCurrentBusiness(player) {
	if (!player.info.canOpen.business) return;
	const id = player.info.canOpen.business;
	return getBusiness(id);
}


mp.events.addCommand(
{
	'setbusbuyermenu' : async (player, id) => {
		if (player.info.adminLvl < 1) return;
		const coord = misc.convertOBJToJSON(player.position, player.heading);
		await misc.query(`UPDATE business SET buyerMenuCoord = '${coord}' WHERE id = ${id}`);
		updateLanguage(player);
		player.notify("~g~" +doneText);

	},	
});