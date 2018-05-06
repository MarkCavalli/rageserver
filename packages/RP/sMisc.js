"use strict"

const mysql = require("mysql");
const connection =  mysql.createPool({
	host			:	"localhost",
	user			: 	"root",
	password		: 	"",
	database		:	"rpserver",
});

connection.getConnection(function(e) {
	if (e) 	{
		console.log("DATABASE IS NOT WORKING");
		throw e;
	}
	else 	{
		console.log(`DATABASE IS WORKING`);
	}
});

function dbquery(query) {
    return new Promise( (r, j) => connection.query(query, null , (err, data) => {
		if (err) {
			console.log(query);
			return j(err);
		}
		r(data);
	}))
}

async function query(query) {
	const start = new Date().getTime(); 
	const data = await dbquery(query);
	const time = new Date().getTime() - start;
	console.log(`'${query}' ends with: ${time / 1000}s`);
	//console.log(data);
	return data;
}
module.exports.query = query;

function roundNum(number, ends = 0) {
	return parseFloat(number.toFixed(ends));
}
module.exports.roundNum = roundNum;

function convertOBJToJSON(pos, rot, changeHeight = 0) {
	const obj = {
		x: roundNum(pos.x, 3),
		y: roundNum(pos.y, 3),
		z: roundNum(pos.z + changeHeight, 3),
		rot: roundNum(rot, 2),
	}
	return JSON.stringify(obj);
}
module.exports.convertOBJToJSON = convertOBJToJSON;

function setPlayerPosFromJSON(player, json) {
	const d = JSON.parse(json);
	player.position = new mp.Vector3(d.x, d.y, d.z);
	player.heading = d.rot;
}
module.exports.setPlayerPosFromJSON = setPlayerPosFromJSON;

function isValueNumber(value) {
	if (typeof value !== "number") {
		return false;
	}
	return true;
}
module.exports.isValueNumber = isValueNumber;