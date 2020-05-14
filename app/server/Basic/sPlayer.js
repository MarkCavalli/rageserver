const misc = require('../sMisc');
const i18n = require('../sI18n');
const moneySingleton = require('./Money/sMoney');
const characterSingleton = require('../Character/sCharacterCreator');
const clothesSingleton = require('../Character/sClothes');
const headOverlaySingleton = require('../Character/sHeadOverlay');
const vehiclesSingleton = require('../Basic/Vehicles/sVehicleSingletone');
const faction = require('../Factions/sFaction');
const hospital = require('../Factions/Hospital/sHospital');
const prison = require('../Factions/Police/Prison/sPrison');

class PlayerSingleton {

    async createNewUser(player, email, firstName, lastName, pass) {
        const firstSpawn = { 
            x: -164, 
            y: 6426, 
            z: 32, 
            rot: 48, 
            dim: 0, 
        }
        await misc.query(`INSERT INTO users 
        (email, firstName, lastName, password, ip, regdate, position, socialclub) VALUES 
        ('${email}', '${firstName}', '${lastName}', '${pass}', '${player.ip}', '${new Date().toLocaleString()}', '${JSON.stringify(firstSpawn)}', '${player.socialClub}')`);

        misc.log.debug(`New Account: ${email} | ${firstName} ${lastName}`);
    }

    async loadAccount(player, id) {
        const d = await misc.query(`SELECT * FROM users WHERE id = '${id}' LIMIT 1`);
        player.loggedIn = true;
        player.guid = d[0].id;
        player.email = d[0].email;
        player.firstName = d[0].firstName;
        player.lastName = d[0].lastName;
        player.adminlvl = d[0].adminlvl;
        player.lang = d[0].lang;
        player.loyality = d[0].loyality;
        player.updateName();
        player.tp(JSON.parse(d[0].position));
        player.health = d[0].health;
        player.call("cCloseCefAndDestroyCam");
		
		player.job = { 
			name: i18n.get('sJob', 'unemployed', player.lang),
			id: 0,
			idjob: 0,
			xp: 0,
			ammount: 0,
			maxammount: 0,
			active: 0,
			money: 0,
		};


        const q1 = moneySingleton.loadUser(player);
        const q2 = characterSingleton.loadPlayerBody(player);
        const q3 = clothesSingleton.loadPlayerClothes(player);
        const q4 = headOverlaySingleton.loadUser(player);
        const q5 = vehiclesSingleton.loadPlayerVehicles(player.guid);
        const q6 = faction.loadUser(player);
        const q7 = hospital.loadUser(player);
        const q8 = prison.loadUser(player);
        await Promise.all([q1, q2, q3, q4, q5, q6, q7, q8]);

        misc.log.debug(`${player.name} logged in`);
    }

    saveAccount(player) {
        player.saveBasicData();
        vehiclesSingleton.savePlayerVehicles(player.guid);
        prison.savePlayerAccount(player);
//        misc.log.debug(`${player.name} disconnected`);
//        player.loggedIn = false;
    }

    loadPlayerTemplate(player) {
        player.loggedIn = false;
        player.lang = 'eng';
        player.guid = false;
        player.email = false;
        player.firstName = false;
        player.lastName = false;
        player.loyality = 0;
        player.adminlvl = 0;
        player.faction = {};
        player.canOpen = {};
        player.canEnter = {};
        player.job = {
            id: 0,
            idjob: 0,
            name: i18n.get('sJob', 'unemployed', player.lang),
            xp: 0,
            ammount: 0,
            maxammount: 0,
            money: 0,
            active: 0,
            deliveryPointsPlayer: [],
        };


        player.updateName = function() {
            this.name = `${this.firstName} ${this.lastName}`;
        }
        player.tp = function(d) {
            this.position = new mp.Vector3(d.x, d.y, d.z);
            this.heading = d.rot;
            this.dimension = 0;
            if (d.dim) this.dimension = d.dim;
        }

        player.tpWithVehicle = function(d) {
            if (!this.isDriver() || !this.vehicle) return;
            this.vehicle.position = new mp.Vector3(d);
            this.heading = d.rot;
            this.vehicle.dimension = d.dim;
        }

        player.getCurrentPos = function(changeHeight = 0) {
            const obj = {
                x: misc.roundNum(this.position.x, 1),
                y: misc.roundNum(this.position.y, 1),
                z: misc.roundNum(this.position.z + changeHeight, 1),
                rot: misc.roundNum(this.heading, 1),
                dim: this.dimension,
            }
            return obj;
        }

        player.addLoyality = function(value) {
            value = misc.roundNum(value);
			if (value === 0) return;
            this.loyality += value;
            this.showLoyalityNotification(value);
        }

        player.removeLoyality = function(value) {
            value = misc.roundNum(value);
            this.loyality -= value;
            if (this.loyality < 0) this.loyality = 0;
            this.showLoyalityNotification(-value);
        }

        player.showLoyalityNotification = function(value) {
            let plus = "";
            if (value > 0) plus = "+";
            this.notify(`${i18n.get('sLoyality', 'loyality', this.lang)} ~b~${plus}${value}`);
        }

        player.saveBasicData = function() {
            const pos = this.getCurrentPos(0.1);
            misc.query(`UPDATE users SET ip = '${this.ip}', logdate = '${new Date().toLocaleString()}', position = '${JSON.stringify(pos)}', health = '${this.health}', loyality = '${this.loyality}' WHERE id = '${this.guid}'`);
        }

        player.isDriver = function() {
            if (!this.vehicle || this.seat !== 0) return false;
            return true;
        }
        
    }

}
const playerSingleton = new PlayerSingleton();
module.exports = playerSingleton;


mp.events.addCommand({
    'save' : (player) => {
//      if (!player.loggedIn || player.adminlvl < 1) return;
        if (!player.loggedIn) return;
        playerSingleton.saveAccount(player);
        player.outputChatBox(`${i18n.get('sLogin', 'saveGame', player.lang)}`);
    },


    'pos' : (player) => { 
        if (player.adminlvl < 1) return;
        const pos = player.position;
        let rot;
        if (player.vehicle) rot = player.vehicle.rotation.z
        else rot = player.heading;
        const str = `x: ${misc.roundNum(pos.x, 3)}, y: ${misc.roundNum(pos.y, 3)}, z: ${misc.roundNum(pos.z, 3)}, rot: ${misc.roundNum(rot, 2)}`;
        player.outputChatBox(str);
        misc.log.debug(str);
    },
    
});

// Save Player bei allem möglichem

// Save by enter Vehicle
function playerStartEnterVehicleHandler(player) {
 
    if (!player.loggedIn) return;
    playerSingleton.saveAccount(player);
    player.notifyWithPicture("System", "Account Saving", "~g~Your Account was saved.", "CHAR_BLOCKED");
//    player.outputChatBox(`${i18n.get('sLogin', 'saveGame', player.lang)}`);
}
 
 mp.events.add("playerStartEnterVehicle", playerStartEnterVehicleHandler);

// Save by exit Vehicle
function playerExitVehicleHandler(player) {
    if (!player.loggedIn) return;
    playerSingleton.saveAccount(player);
    player.notifyWithPicture("System", "Account Saving", "~g~Your Account was saved.", "CHAR_BLOCKED");
//    player.outputChatBox(`${i18n.get('sLogin', 'saveGame', player.lang)}`);
}

    mp.events.add("playerExitVehicle", playerExitVehicleHandler);