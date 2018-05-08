"use strict"

const misc = require('./sMisc');
const crypto = require('crypto');


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
    const str = "showError();";
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
        const d = await misc.query(`SELECT * FROM users WHERE username = '${player.name}'`);
        if (!d[0]) {
            showRegisterCef(player);
        }
        else if(d[0].username === player.name) {
            showLoginCef(player);
            player.tempData = d[0];
        }
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
		await misc.query(`INSERT INTO users (username, password, money, position, dim, signupdate) VALUES ('${player.name}', '${newPass}', '1500', '${position}', '0', '${new Date()}')`);
        setTimeout(showLoginCef, 2000, player);
        misc.log.debug(`${player.name} register an account`);
    },

    "sTryLogin" : async (player, pass) => {
        const hash = hashPassword(pass);
		if (hash !== player.tempData.password) {
            return showError(player);
        }
        showSuccess(player);
        await loadPlayerAccount(player);
        player.call("cCloseCefAndDestroyCam");
        misc.log.debug(`${player.name} logged in`);
    },
    
    "playerQuit" : (player, exitType, reason) => {
        savePlayerAccount(player);
        misc.log.debug(`${player.name} disconnected in`);
    },

    "playerDeath" : (player, reason, killer) => { // Temporary Respawn;
        player.spawn(new mp.Vector3(player.position));
        player.health = 90;
    },

});

mp.events.addCommand(
{
    'save' : (player) => {
        savePlayerAccount(player);
        player.outputChatBox(`Account successfully saved!`);
    }, 

    'v' : (player, fullText, model) => {  // Temporary vehicle spawning
		let vehicle = mp.vehicles.new(model, player.position,
		{
            heading: player.heading,
            color: [[156, 156, 156],[156, 156, 156]],
		});
        player.putIntoVehicle(vehicle, -1);
        misc.log.debug(`${player.name} spawned ${model}`);
	},
    
});       
    
function savePlayerAccount(player) {
    if (!player.loggedIn) return;
    const position = misc.convertOBJToJSON(player.position, player.heading, 0.1);
    misc.query(`UPDATE users SET position = '${position}', dim = '${player.dimension}', lastlogindate = '${new Date()}' WHERE username = '${player.name}'`);
}

async function loadPlayerAccount(player) {
    player.loggedIn = true;
    const pData = player.tempData;
    misc.setPlayerPosFromJSON(player, pData.position);
    player.dimension = pData.dim;
    player.call("cMoneyUpdate", [pData.money]);
}