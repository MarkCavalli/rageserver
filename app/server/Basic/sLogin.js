"use strict"

const misc = require('../sMisc');
const charCreator = require('../Character/sCharacterCreator');
const clothes = require('../Character/sClothes');
const crypto = require('crypto');
const vehicleAPI = require('./sVehicle');
const loyality = require('./sLoyality');
const faction = require('./../Factions/sFaction');
const hospital = require('./../Factions/sHospital');


function hashPassword(str) {
    const cipher = crypto.createCipher('aes192', 'a pass');
	let encrypted = cipher.update(str, 'utf8', 'hex'); 
    encrypted += cipher.final('hex');
    return encrypted;
}

function showSuccess(player) {
    const str = "showSuccess();";
    player.call("cInjectCef", [str]);
}

function showError(player) {
    let str = "showError();";
    if (player.name === "WeirdNewbie") str += "showDefNameError();"
    player.call("cInjectCef", [str]);
}

function showLoginCef(player) {
    player.call("cShowLoginCef", ["package://RP/Browsers/Login/login.html"]);
}

function showRegisterCef(player) {
    player.call("cShowLoginCef", ["package://RP/Browsers/Login/register.html"]);
}

mp.events.add(
{
    "playerReady" : async (player) => {
        player.spawn(new mp.Vector3(3222, 5376, 20));
        player.dimension = 1001;
        const d = await misc.query(`SELECT username, password FROM users WHERE username = '${player.name}' LIMIT 1`);
        if (!d[0]) {
            showRegisterCef(player);
        }
        else if(d[0].username === player.name) {
            showLoginCef(player);
            player.info = d[0];
        }
        misc.log.debug(`${player.name} connected`);
        player.outputChatBox(`Please, dont use non-standart chars in your username`);
    },
        
    "sTryRegister" : async (player, pass) => {
        const d = await misc.query(`SELECT username FROM users ORDER BY id DESC LIMIT 5`);
        for (let i = 0; i < d.length; i++) {
			if (d[i].username === player.name) {
                return showError(player);
			}
        }
        showSuccess(player);
        const newPass = hashPassword(pass);
        const firstSpawn = {
            x: -164,
            y: 6426,
            z: 32,
        }
        const position = misc.convertOBJToJSON(firstSpawn, 48);
        const query1 = misc.query(`INSERT INTO users (username, password, money, position, dim, signupdate) VALUES ('${player.name}', '${newPass}', '1500', '${position}', '0', '${new Date()}')`);
        const query2 = charCreator.insertNewUser();
        const query3 = faction.insertNewUser();
        await Promise.all([query1, query2, query3]);
        setTimeout(showLoginCef, 2000, player);
        misc.log.debug(`${player.name} register an account`);
        player.info = {
            username: player.name,
            password: newPass,
        };
    },

    "sTryLogin" : async (player, pass) => {
        const hash = hashPassword(pass);
		if (hash !== player.info.password) {
            misc.log.debug(`${player.name} entered wrong password!`);
            return showError(player);
        }
        showSuccess(player);
        await loadPlayerAccount(player);
        await charCreator.loadPlayerAppearance(player);
        await clothes.loadPlayerClothes(player);
        await vehicleAPI.loadPlayerVehicles(player);
        hospital.loadPlayerAccount(player);
        misc.log.debug(`${player.name} logged in`);
    },
    
    "playerQuit" : (player, exitType, reason) => {
        if (!misc.isPlayerLoggedIn(player)) return;
        savePlayerAccount(player);
    },

});

mp.events.addCommand(
{
    'save' : (player) => {
        if (player.info.adminLvl < 1) return;
        savePlayerAccount(player);
        player.outputChatBox(`Account successfully saved!`);
    }, 
 
    'pos' : (player, fullText, model) => { 
        if (player.info.adminLvl < 1) return;
        const pos = player.position;
        let rot;
        if (player.vehicle) {
            rot = player.vehicle.rotation.z
        }
        else {
            rot = player.heading;
        }
        const str = `x: ${misc.roundNum(pos.x, 3)}, y: ${misc.roundNum(pos.y, 3)}, z: ${misc.roundNum(pos.z, 3)}, rot: ${misc.roundNum(rot, 2)}`;
        player.outputChatBox(str);
        misc.log.debug(str);
    },
    
    'setlang' : (player, fullText, lang) => { 
		if (lang !== "eng" && lang !== "rus" && lang !== "ger" && lang !== "br") {
            return player.outputChatBox("Server does not support your language! Available languages: eng, rus, ger, br.");
        }
        player.notify(`Current language: ~g~${lang}`);
        misc.query(`UPDATE users SET lang = '${lang}' WHERE username = '${player.name}'`);
        player.info.lang = lang;
    },
    
});       
    

function savePlayerAccount(player) {
    const position = misc.convertOBJToJSON(player.position, player.heading, 0.1);
    misc.query(`UPDATE users SET position = '${position}', dim = '${player.dimension}', lastlogindate = '${new Date()}', health = '${player.health}' WHERE username = '${player.name}'`);
    vehicleAPI.savePlayerVehicles(player.name);
    loyality.saveLoyality(player.name, player.info.loyality);
    misc.log.debug(`${player.name} disconnected`);
}

async function loadPlayerAccount(player) {
    const d = await misc.query(`SELECT * FROM users WHERE username = '${player.name}' LIMIT 1`);
    player.info = {
        loggedIn: true,
        id: d[0].id,
        money: d[0].money,
        bmoney: d[0].bmoney,
        tmoney: d[0].tmoney,
        pmoney: d[0].pmoney,
        canOpen: {},
        adminLvl: d[0].adminlvl,
        activeJob: {
            name: false,
        },
        hasBusiness: d[0].hasBusiness,
        lang: d[0].lang,
        loyality: d[0].loyality,
        hospital: {},
    }
    misc.setPlayerPosFromJSON(player, d[0].position);
    player.dimension = d[0].dim;
    player.health = d[0].health;
    player.call("cMoneyUpdate", [d[0].money]);
    player.call("cCloseCefAndDestroyCam");
    player.outputChatBox("Choose your language: /setlang [language]! Available languages: eng, rus, ger, br.");
    player.outputChatBox("Spawn a vehicle: /veh");
    player.outputChatBox("Global chat: /g [message]");
    
}