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
		log.error("DATABASE IS NOT WORKING");
		throw e;
	}
	else 	{
		log.debug(`DATABASE IS WORKING`);
	}
});

const log4js = require('log4js');
log4js.configure({
    appenders: { 
        file: { type: 'file', filename: `serverLogs.log` },
        console: { type: 'console' },
    },
    categories: { default: { appenders: ['file', 'console'], level: 'debug' } }
  });
const log = log4js.getLogger();
log.fatal("Server Started");
exports.log = log;

/*
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.log('Something funny about cheese.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese %s is too ripe!', 'gouda');
logger.fatal('Cheese was breeding ground for listeria.');
*/


function dbquery(query) {
    return new Promise( (r, j) => connection.query(query, null , (err, data) => {
		if (err) {
			log.error(query);
			return j(err);
		}
		r(data);
	}))
}

async function query(query) {
	const start = new Date().getTime(); 
	const data = await dbquery(query);
	const time = new Date().getTime() - start;
	if (time >= 500) {
		log.warn(`'${query}' ends with: ${time / 1000}s`);
	}
	else {
		log.trace(`'${query}' ends with: ${time / 1000}s`);
	}
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

function isValueString(value) {
	if (typeof value !== "string") {
		return false;
	}
	return true;
}
module.exports.isValueString = isValueString;

function getRandomInt(min = 0, max = 100) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports.getRandomInt = getRandomInt;

function isPlayerLoggedIn(player) {
	if (!player.info || !player.info.loggedIn) return false;
	return true;
}
module.exports.isPlayerLoggedIn = isPlayerLoggedIn;

function getPlayerLang(player) {
	return player.info.lang;
}
module.exports.getPlayerLang = getPlayerLang;