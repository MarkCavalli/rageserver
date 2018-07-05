"use strict"

const misc = require('../sMisc');
const vehicleAPI = require('../Basic/sVehicle');

class building {
	constructor() {
		
	}

	createBlip(id, pos, color, name, scale, dim) {
		if (!misc.isValueNumber(id) || !misc.isValueNumber(color) || !misc.isValueString(name) || !misc.isValueNumber(scale) || !misc.isValueNumber(dim)) {
			console.log(`sBuilding: Incorrect createBlip`);
			console.log(id);
			console.log(pos);
			console.log(color);
			console.log(name);
			console.log(scale);
			console.log(dim);
			return;
		}
		const blip = mp.blips.new(id, new mp.Vector3(pos.x, pos.y, pos.z),
		{	
			shortRange: true,
			color: color,
			name: name,
			scale: scale,
			dimension: dim,
		});
		return blip;
	}

	createMarker(id, pos, height, radius, color, dim) {
		if (!misc.isValueNumber(id) || !misc.isValueNumber(height) || !misc.isValueNumber(radius) ||  !misc.isValueNumber(dim)) {
			console.log(`sBuilding: Incorrect createBlip`);
			console.log(id);
			console.log(pos);
			console.log(height);
			console.log(color);
			console.log(color);
			console.log(dim);
			return;
		}
		const marker = mp.markers.new(id, new mp.Vector3(pos.x, pos.y, pos.z + height), radius, 
		{
			color: color,
			dimension: dim,
		});
		return marker;
	}

	createDoubleEntrance(d) {
		if (d.outBlipId) {
			this.createBlip(d.outBlipId, d.outPos, d.outBlipCol, d.outBlipName, d.outBlipScale, d.outPos.dim);
		}
		if (d.inBlipId) {
			this.createBlip(d.inBlipId, d.inPos, d.inBlipCol, d.inBlipName, d.inBlipScale, d.inPos.dim);
		}
		
		const outShape = mp.colshapes.newSphere(d.outPos.x, d.outPos.y, d.outPos.z, d.outShapeR);
		outShape.dimension = d.outPos.dim;
		const inShape = mp.colshapes.newSphere(d.inPos.x, d.inPos.y, d.inPos.z, d.inShapeR);
		inShape.dimension = d.inPos.dim;
		
		if (d.outMarkerId) {
			this.createMarker(d.outMarkerId, d.outPos, d.outMarkerHeightAdjust, d.outMarkerR, d.outMarkerCol, d.outPos.dim);
		}
		if (d.inMarkerId) {
			this.createMarker(d.inMarkerId, d.inPos, d.inMarkerHeightAdjust, d.inMarkerR, d.inMarkerCol, d.outPos.dim);
		}

		mp.events.add({
			"playerExitColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				if (shape === outShape || shape === inShape) {
					player.info.canEnter = false;
				}
			},
		});

		const obj = {
			out: outShape,
			in: inShape,
		}
		return obj;
	}

	createSingleEntrance(d) {
		if (d.outBlipId) {
			this.createBlip(d.outBlipId, d.outPos, d.outBlipCol, d.outBlipName, d.outBlipScale, d.outPos.dim);
		}
		
		const outShape = mp.colshapes.newSphere(d.outPos.x, d.outPos.y, d.outPos.z, d.outShapeR);
		outShape.dimension = d.outPos.dim;
		
		if (d.outMarkerId) {
			this.createMarker(d.outMarkerId, d.outPos, d.outMarkerHeightAdjust, d.outMarkerR, d.outMarkerCol);
		}
	
		mp.events.add({
			"playerExitColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				if (shape === outShape) {
					player.info.canEnter = false;
				}
			},
		});

		const obj = {
			out: outShape,
		}
		return obj;
	}

	enter(player, d) {
		player.position = new mp.Vector3(d);
		player.heading = d.rot;
		player.dimension = d.dim;
	}

	enterByVeh(player, d) {
		if (!vehicleAPI.isDriver(player)) return;
		const vehicle = player.vehicle;
		vehicle.position = new mp.Vector3(d);
		vehicle.rotation.z = d.rot;
		vehicle.dimension = d.dim;
	}

}
module.exports = building;