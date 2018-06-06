"use strict"

const misc = require('/RP/cMisc');
const player = mp.players.local;
let fuel = null, fuelRate = 0, speed, showSpeedText = false;





mp.events.add(
{
	"cVehicle-setFuel" : (fuelValue, fuelRateValue, showSpeed) => {
		showSpeedText = showSpeed;
		if (!fuelValue || typeof fuelValue !== "number") {
			return fuel = null;
		}
		fuel = fuelValue; 
		fuelRate = fuelRateValue;
	},
	
	"render" : () => {
		if (mp.gui.cursor.visible || !player.vehicle) return;
		speed = misc.roundNum(player.vehicle.getSpeed() * 4);
		player.vehicle.setLightMultiplier(4);
		if (showSpeedText) showSpeed();
		if (fuel !== null && player.vehicle.getIsEngineRunning()) showFuel();
		

	},
	
	"playerLeaveVehicle" : () => {
		if (fuel !== null) mp.events.callRemote('sVehicle-SetFuel', player.vehicle, fuel); 
	},

	"cVehicle-setLights" : (vehicle, state) => {
		vehicle.setLights(state);
	},

	"cVehicle-rollUpWindow" : (vehicle, window) => {
		vehicle.rollUpWindow(window);
	},

	"cVehicle-rollDownWindow" : (vehicle, window) => {
		vehicle.rollDownWindow(window);
	},

});


function showSpeed() {
	const vehicle = player.vehicle;
	mp.game.graphics.drawText("     Speed: " + speed + " km/h", [0.920, 0.835], { 
		font: 1, 
		color: [255, 255, 255, 255], 
		scale: [0.6, 0.6], 
	});
	if (speed === 0) vehicle.setBrakeLights(true);
}

function showFuel() {
	const vehicle = player.vehicle;
	mp.game.graphics.drawText("         Fuel: " + fuel.toFixed() + " L", [0.927, 0.80], { 
		font: 1, 
		color: [255, 255, 255, 255], 
		scale: [0.6, 0.6], 
	});
	const rpm = misc.roundNum(vehicle.rpm * 5000);
	let gear = vehicle.gear;
	if (gear === 0) gear = 1;

	fuel -= (rpm + (speed * 400)) / gear * fuelRate * Math.pow(5, -13);
}