
const misc = require('../../sMisc');
const i18n = require('../../sI18n');


class Vehicle {
	constructor (d) {
		const pos = JSON.parse(d.coord);
		const vehicle = mp.vehicles.new(d.model, new mp.Vector3(pos.x, pos.y, pos.z),
		{
			heading: pos.rot,
			dimension: pos.dim,
			locked: true,
			engine: false,
		});
		vehicle.guid = d.id;
		vehicle.title = d.title;
		vehicle.fuel = d.fuel;
		vehicle.fuelTank = d.fuelTank;
		vehicle.fuelRate = d.fuelRate;
		vehicle.price = d.price;
		vehicle.ownerId = d.ownerId;
		vehicle.whoCanOpen = JSON.parse(d.whoCanOpen);
		vehicle.factionName = d.factionName;
		vehicle.windowsOpened = [false, false, false, false];
		vehicle.numberPlate = d.numberPlate;

		const primaryColor = JSON.parse(d.primaryColor);
		const secondaryColor = JSON.parse(d.secondaryColor);
		vehicle.setColorRGB(primaryColor[0], primaryColor[1], primaryColor[2], secondaryColor[0], secondaryColor[1], secondaryColor[2]);

		vehicle.canOpen = function(player) {
			if (player.dimension !== this.dimension) return false;
			if (player.faction.name && player.faction.name === this.factionName) return true;
			for (const p of this.whoCanOpen) {
				if (p !== player.guid) continue;
				return true;
			}
			return false;
		}

		vehicle.toggleDoorsLock = function(player) {
			if (vehicle.locked) {
				this.unlock();
				player.outputChatBox(`${this.title} !{0, 200, 0}${i18n.get('sVehicle', 'unlocked', player.lang)}`);
			}
			else {
				this.lock();
				player.outputChatBox(`${this.title} !{200, 0, 0}${i18n.get('sVehicle', 'locked', player.lang)}`);
			}
			vehicle.locked = !vehicle.locked;
		}
		
		vehicle.lock = function() {
			if (this.getOccupants().length === 0) this.blinkLights(); 
		}

		vehicle.unlock = function() {
			if (this.getOccupants().length === 0) {
				this.blinkLights();
				setTimeout(() => {
					this.blinkLights();
				}, 600);
			}
		}

		vehicle.blinkLights = function() { 
			const engineStatus = this.engine;
			if (!engineStatus) this.engine = true;
		
			const players = mp.players.toArray();
			for (const player of players) {
				player.call("cVehicle-setLights", [this, 2]);
				setTimeout(() => {
					player.call("cVehicle-setLights", [this, 0]);
				}, 300);
			}

			if (!engineStatus) {
				setTimeout(() => {
					this.engine = engineStatus;
				}, 300);
			}
		}

		vehicle.canRollWindow = function(player, window) {
			if (player.isDriver() || player.seat + 1 === window) return true;
			return false;
		}

		vehicle.toggleWindow = function(player, window) {
			if (!this.canRollWindow(player, window)) return;
			const windowOpened = this.windowsOpened[window];
			let action;
			if (windowOpened) action = "cVehicle-rollUpWindow";
			else action = "cVehicle-rollDownWindow";
			mp.players.forEach((p, id) => {
				p.call(action, [this, window]);
			});
			vehicle.windowsOpened[window] = !windowOpened;
		}

		vehicle.fillUp = async function(litres) {
			vehicle.fuel += litres;
			if (vehicle.fuel > vehicle.fuelTank) vehicle.fuel = vehicle.fuelTank;
		}

		vehicle.sellToGovernment = async function(player) {
			if (!vehicle.ownerId !== player.guid) return;
			player.addBankMoney(this.price / 2, `${i18n.get('sVehicle', 'sellVehicle', player.lang)}`);
			await misc.query(`DELETE FROM vehicles WHERE id = ${vehicle.guid} AND ownerId = '${player.guid}' LIMIT 1`);
			this.destroy();
		}

		return vehicle;
	}

}
module.exports = Vehicle;