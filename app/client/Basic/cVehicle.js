"use strict"

const misc = require('../cMisc');
const player = mp.players.local;

class cVehicle {
	constructor() {
		this.fuel = null;
		this.fuelRate = 0;
		this.speed = 0;

		mp.events.add({
			"cVehicle-setFuel" : (fuel, fuelRate) => this.setFuel(fuel, fuelRate),

			"playerLeaveVehicle" : () => {
				if (this.fuel !== null) mp.events.callRemote('sVehicle-SetFuel', player.vehicle, this.fuel); 
			},

			"cVehicle-setLights" : (vehicle, state) => {
				vehicle.setLights(state);
			},

			"cVehicle-rollUpWindow" : (vehicle, window) => vehicle.rollUpWindow(window),
			"cVehicle-rollDownWindow" : (vehicle, window) => vehicle.rollDownWindow(window),
			
			"render" : () => {
				this.setLightMultiplier();
				this.showSpeed();
				this.showFuel();
				this.showBrakeLights();
			},
		});
	}

	setFuel(fuel, fuelRate, showSpeed) {
		if (typeof fuel !== "number") return this.fuel = null;
		this.fuel = fuel; 
		this.fuelRate = fuelRate;
	}

	setLightMultiplier() {
		if (player.vehicle) player.vehicle.setLightMultiplier(4);
	}

	showSpeed() {
		const vehicle = player.vehicle;
		if (!vehicle || mp.gui.cursor.visible) return;
		this.speed = misc.roundNum(vehicle.getSpeed() * 4);
		mp.game.graphics.drawText("     Speed: " + this.speed + " km/h", [0.920, 0.835], { 
			font: 1, 
			color: [255, 255, 255, 255], 
			scale: [0.6, 0.6], 
		});
	}

	showFuel() {
		const vehicle = player.vehicle;
		if (mp.gui.cursor.visible || !vehicle || this.fuel === null || !vehicle.getIsEngineRunning()) return;
		mp.game.graphics.drawText("         Fuel: " + this.fuel.toFixed(1) + " L", [0.927, 0.80], { 
			font: 1, 
			color: [255, 255, 255, 255], 
			scale: [0.6, 0.6], 
		});
		const rpm = misc.roundNum(vehicle.rpm * 5000);
		let gear = vehicle.gear;
		if (gear === 0) gear = 1;
	
		this.fuel -= (rpm + (this.speed * 400)) / gear * this.fuelRate * Math.pow(5, -13);
	
		if (this.fuel < 0.1) mp.events.callRemote('sVehicle-SetFuel', vehicle, this.fuel);
	}

	showBrakeLights() {
		if (!player.vehicle || this.speed !== 0) return;
		player.vehicle.setBrakeLights(true);
	}

	getIntoVehicleAsPassenger() {
		if (mp.gui.cursor.visible || player.vehicle) return;
		const pos = player.position;
		const vehHandle = mp.game.vehicle.getClosestVehicle(pos.x, pos.y, pos.z, 5, 0, 70);
		const vehicle = mp.vehicles.atHandle(vehHandle);

		if (!vehicle || !vehicle.isAnySeatEmpty() || vehicle.getSpeed() > 5) return;

		for (let i = 0; i < vehicle.getMaxNumberOfPassengers(); i++) {
			if (!vehicle.isSeatFree(i)) continue;
			player.taskEnterVehicle(vehicle.handle, 5000, i, 1, 1, 0);
			break;
		}	
	}
}

const veh = new cVehicle();

mp.keys.bind(71, false, function() {     // G
    veh.getIntoVehicleAsPassenger();
});
