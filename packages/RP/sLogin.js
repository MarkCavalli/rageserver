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

async function showLoginCef(player) {
    player.call("cShowLoginCef", ["package://RP/Browsers/Login/login.html"]);
    const d = await misc.query(`SELECT * FROM users WHERE username = '${player.name}'`);
    player.tempData = d[0];
}

function showRegisterCef(player) {
    player.call("cShowLoginCef", ["package://RP/Browsers/Login/register.html"]);
}

mp.events.add(
{
    "playerReady" : async (player) => {
        player.position = new mp.Vector3(3222, 5376, 20);
        player.dimension = 1001;
        player.heading = 207;
        const d = await misc.query(`SELECT username FROM users`);
        for (let i = 0; i < d.length; i++) {
			if (d[i].username === player.name) {
				showLoginCef(player);
				break;
			}
			else if (d[d.length - 1].username !== player.name && i === d.length - 1) {
                showRegisterCef(player);
			}
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
		await misc.query(`INSERT INTO users (username, password, money, position, dim) VALUES ('${player.name}', '${newPass}', '1500', '${position}', '0')`);
        setTimeout(showLoginCef, 2000, player);
    },

    "sTryLogin" : async (player, pass) => {
        const hash = hashPassword(pass);
		if (hash !== player.tempData.password) {
            return showError(player);
        }
        showSuccess(player);
        await loadPlayerAccount(player);
        player.call("cCloseCefAndDestroyCam");
    },
    
    "playerQuit" : (player, exitType, reason) => {
		savePlayerAccount(player);
    },

});

mp.events.addCommand(
{
    'save' : (player) => {
        savePlayerAccount(player);
        player.outputChatBox(`Account successfully saved!`);
    }, 
    
});       
    
function savePlayerAccount(player) {
    if (!player.loggedIn) return;
    const position = misc.convertOBJToJSON(player.position, player.heading, 0.1);
    misc.query(`UPDATE users SET position = '${position}', dim = '${player.dimension}' WHERE username = '${player.name}'`);
}

async function loadPlayerAccount(player) {
    player.loggedIn = true;
    const pData = player.tempData;
    misc.setPlayerPosFromJSON(player, pData.position);
    player.dimension = pData.dim;
    player.call("cMoneyUpdate", [pData.money]);
}