const misc = require('../sMisc');


const buildingList = [];
let entranceId = 1;


class building {
	constructor() {
		this.id = buildingList.length + 1;
		buildingList.push(this);
	}

	createBlip(id, pos, color, name, scale, dim) {
		if (!misc.isValueNumber(id) || !misc.isValueNumber(color) || !misc.isValueString(name) || !misc.isValueNumber(scale) || !misc.isValueNumber(dim)) return;
		return mp.blips.new(id, new mp.Vector3(pos.x, pos.y, pos.z),{ shortRange: true, color, name, scale, dimension: dim });
	}

	createMarker(id, pos, height, radius, color, dim) {
		if (!misc.isValueNumber(id) || !misc.isValueNumber(height) || !misc.isValueNumber(radius) ||  !misc.isValueNumber(dim)) return;
		return mp.markers.new(id, new mp.Vector3(pos.x, pos.y, pos.z + height), radius, { color, dimension: dim });
	}

	createDoubleEntrance(d) {
		if (d.outBlipId) this.createBlip(d.outBlipId, d.outPos, d.outBlipCol, d.outBlipName, d.outBlipScale, d.outPos.dim);
		if (d.inBlipId) this.createBlip(d.inBlipId, d.inPos, d.inBlipCol, d.inBlipName, d.inBlipScale, d.inPos.dim);
		
		const outShape = mp.colshapes.newSphere(d.outPos.x, d.outPos.y, d.outPos.z, d.outShapeR);
		outShape.dimension = d.outPos.dim;
		this.setShapeData(outShape);
		const inShape = mp.colshapes.newSphere(d.inPos.x, d.inPos.y, d.inPos.z, d.inShapeR);
		inShape.dimension = d.inPos.dim;
		this.setShapeData(inShape);
		
		if (d.outMarkerId) this.createMarker(d.outMarkerId, d.outPos, d.outMarkerHeightAdjust, d.outMarkerR, d.outMarkerCol, d.outPos.dim);
		if (d.inMarkerId) this.createMarker(d.inMarkerId, d.inPos, d.inMarkerHeightAdjust, d.inMarkerR, d.inMarkerCol, d.outPos.dim);

		const obj = { out: outShape, in: inShape }
		return obj;
	}

	createSingleEntrance(d) {
		if (d.outBlipId) this.createBlip(d.outBlipId, d.outPos, d.outBlipCol, d.outBlipName, d.outBlipScale, d.outPos.dim);
		if (d.outMarkerId) this.createMarker(d.outMarkerId, d.outPos, d.outMarkerHeightAdjust, d.outMarkerR, d.outMarkerCol);
		const outShape = mp.colshapes.newSphere(d.outPos.x, d.outPos.y, d.outPos.z, d.outShapeR);
		outShape.dimension = d.outPos.dim;
		this.setShapeData(outShape);
		const obj = { out: outShape }
		return obj;
	}

	setShapeData(shape) {
		shape.buildingId = this.id;
		shape.entranceId = entranceId;
		entranceId++;
	}


}
module.exports = building;


function getBuilding(id) {
	for (let i = 0; i < buildingList.length; i++) {
		if (buildingList[i].id === id) {
			return buildingList[i];
		}
	}
}
module.exports.getBuilding = getBuilding;

mp.events.add({
	"playerEnterColshape" : (player, shape) => {
		if (!player.loggedIn || !shape.buildingId) return;
		player.canEnter.building = {
			id: shape.buildingId,
			entranceId: shape.entranceId,
		};
		const b = getBuilding(shape.buildingId);
		b.enteredBuildingShape(player, shape.entranceId);		
	},
	
	"sKeys-E" : (player) => {
		if (!player.loggedIn || !player.canEnter.building) return;
		const b = getBuilding(player.canEnter.building.id);
		b.tryToEnter(player, player.canEnter.building.entranceId);	
	},

	"playerExitColshape" : (player, shape) => {
		if (!player.loggedIn || !shape.buildingId) return;
		player.canEnter.building = false;
	},
});