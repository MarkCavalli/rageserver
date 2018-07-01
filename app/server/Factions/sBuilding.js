"use strict"

const misc = require('../sMisc');

class building {
	constructor() {
		
	}

	createBlip(id, pos, color, name) {
		if (!misc.isValueNumber(id) || !misc.isValueNumber(color) || !misc.isValueString(name)) {
			console.log(`sBuilding: Incorrect createBlip`);
			console.log(id);
			console.log(pos);
			console.log(color);
			console.log(name);
			return;
		}
		const blip = mp.blips.new(id, new mp.Vector3(pos.x, pos.y, pos.z),
		{	
			shortRange: true,
			color: color,
			name: name,
		});
		return blip;
	}

	createMarker(id, pos, height, radius, color) {
		if (!misc.isValueNumber(id) || !misc.isValueNumber(height) || !misc.isValueNumber(radius)) {
			console.log(`sBuilding: Incorrect createBlip`);
			console.log(id);
			console.log(pos);
			console.log(height);
			console.log(color);
			console.log(color);
			return;
		}
		const marker = mp.markers.new(id, new mp.Vector3(pos.x, pos.y, pos.z + height), radius, 
		{
			color: color,
		});
		return marker;
	}

	createDoubleEntrance(d) {
		if (d.outBlipId) {
			this.createBlip(d.outBlipId, d.outPos, d.outBlipCol, d.outBlipName);
		}
		if (d.inBlipId) {
			this.createBlip(d.inBlipId, d.inPos, d.inBlipCol, d.inBlipName);
		}
		
		const outShape = mp.colshapes.newSphere(d.outPos.x, d.outPos.y, d.outPos.z, d.outShapeR);
		const inShape = mp.colshapes.newSphere(d.inPos.x, d.inPos.y, d.inPos.z, d.inShapeR);
		
		if (d.outMarkerId) {
			this.createMarker(d.outMarkerId, d.outPos, d.outMarkerHeightAdjust, d.outMarkerR, d.outMarkerCol);
		}
		if (d.inMarkerId) {
			this.createMarker(d.inMarkerId, d.inPos, d.inMarkerHeightAdjust, d.inMarkerR, d.inMarkerCol);
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
			this.createBlip(d.outBlipId, d.outPos, d.outBlipCol, d.outBlipName);
		}
		
		const outShape = mp.colshapes.newSphere(d.outPos.x, d.outPos.y, d.outPos.z, d.outShapeR);
		
		if (d.outMarkerId) {
			this.createMarker(d.outMarkerId, d.outPos, d.outMarkerHeightAdjust, d.outMarkerR, d.outMarkerCol);
		}
	
		mp.events.add({
			"playerExitColshape" : (player, shape) => {
				if (!misc.isPlayerLoggedIn(player)) return;
				if (shape === inShape) {
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
}
module.exports = building;