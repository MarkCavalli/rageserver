
const business = require('./sBusiness');
const misc = require('../sMisc');
const i18n = require('../sI18n');
const carDealership = require('./sCarDealership');



class CommercialCarDealership extends carDealership {
	
	setLocalSettings() {
		this.blip.model = 634;
		this.blip.name = `Commercial Car Dealership`;
		this.blip.color = 38;
	}

	openBuyerMenu(player) {
		if (player.vehicle) return;
		let execute = `app.id = ${this.id};`;
		execute += `app.margin = ${this.margin};`;

		player.call("cCommercialCarDealership-OpenBuyerMenu", [player.lang, execute]);
		misc.log.debug(`${player.name} enter a commercial car dealership menu`);
	}
	
}

async function loadShops() {
	const d = await misc.query("SELECT * FROM business INNER JOIN commercialcardealership ON business.id = commercialcardealership.id");
	for (let i = 0; i < d.length; i++) {
		new CommercialCarDealership(d[i]);
	}
}
loadShops();


mp.events.addCommand({
	'createcommercialcardealership' : async (player, enteredprice) => {
		if (player.adminlvl < 1) return;
		const id = business.getCountOfBusinesses() + 1;
		const coord = misc.getPlayerCoordJSON(player);
		const price = Number(enteredprice.replace(/\D+/g,""));
		const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Commercial Car Dealership', '${coord}', '${price}');`);
		const query2 = misc.query(`INSERT INTO commercialcardealership (id) VALUES ('${id}');`);	
		await Promise.all([query1, query2]);
		player.outputChatBox("!{#4caf50} Cheap Car Dealership successfully created!");
		player.outputChatBox("!{#4caf50} Now do /setbusbuyermenu [id] and other commands!");
	},	

	'setcommercialcardealernewcarcoord' : async (player, id) => {
		if (player.adminlvl < 1) return;
		if (!player.vehicle) return player.nofity(`~r~You're not in vehicle!`);
		const coord = misc.getPlayerCoordJSON(player);
		await misc.query(`UPDATE commercialcardealership SET newCarCoord = '${coord}' WHERE id = ${id}`);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}`);

	},	

});
