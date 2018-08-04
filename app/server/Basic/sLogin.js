"use strict"

const misc = require('../sMisc');
const mailer = require('../sMailer');
const crypto = require('crypto');
const money = require('./sMoney');
const time = require('./sTime');
const charCreator = require('../Character/sCharacterCreator');
const clothes = require('../Character/sClothes');
const headOverlay = require('../Character/sHeadOverlay');
const vehicleAPI = require('./sVehicle');
const faction = require('../Factions/sFaction');
const hospital = require('../Factions/sHospital');
const i18n = require('../sI18n');


class loginClass {
    constructor() {
        mp.events.add({
            "playerReady" : async (player) => {
                player.spawn(new mp.Vector3(3222, 5376, 20));
                player.dimension = 1001;
                player.call("cLogin-ShowLoginWindow");
            },

            "sLogin-TryGetCodeToRegister" : async (player, email) => {
                this.tryGetCodeToRegister(player, email);
            },

            "sLogin-TryValidateEmailWithCode" : async (player, code) => {
                if (player.verificationCode !== code) return;
                player.call("cInjectCef", [`app.setMailChecked();`]);
            },

            "sLogin-CheckUsername" : async (player, obj) => {
                this.checkUsername(player, obj);
            },

            "sLogin-CreateAccount" : async (player, obj) => {
                this.tryCreateAccount(player, obj);
            },

            "sLogin-TryLoginWithoutCode" : async (player, obj) => {
                this.tryLoginWithoutCode(player, obj);
            },

            "sLogin-TryGetCodeToLogin" : async (player, email) => {
                this.tryGetCodeToLogin(player, email);
            },

            "sLogin-TryValidateCodeAndLogIn" : async (player, obj) => {
                this.tryValidateCodeAndLogIn(player, obj);
            },

            "playerQuit" : (player, exitType, reason) => {
                if (!player.loggedIn) return;
                this.saveAccount(player);
            },

        });
    }

    async tryGetCodeToRegister(player, email) {
        const isEmailValid = this.isEmailValid(player, email);
        if (!isEmailValid) return;

        const d = await misc.query(`SELECT email FROM users WHERE email = '${email}' LIMIT 1`);
        if (d[0]) {
            return this.showError(player, "This email already exists");
        }
        this.trySendCode(player, email);
    }

    trySendCode(player, email) {
        if (!player.verificationDate) {
            return this.sendCode(player, email);
        }
        const lastGetCodeTime = ((new Date().getTime() - player.verificationDate) / 1000).toFixed();
        if (lastGetCodeTime < 60) {
            return this.showError(player, `Wait ${60 - lastGetCodeTime} seconds`);
            
        }
        this.sendCode(player, email);
    }

    sendCode(player, email) {
        const code = misc.getRandomInt(100, 999);
        player.verificationCode = code;
        player.verificationDate = new Date().getTime();
        const mail = {
            from: `${mailer.getMailAdress()}`,
            to: `${email}`,
            subject: `Verification code: ${code}`,
            text: `Hello! Your verification code is: ${code}`,
            html: `<b>Hello!</b><br>Your verification code is: ${code}`,
        }
        //console.log(code);
        mailer.sendMail(mail);
        player.call("cInjectCef", [`app.showInfo('Check your mailbox!');`]);
    }

    showError(player, text) {
        player.call("cInjectCef", [`app.showError('${text}');`]);
    }

    isEmailValid(player, email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const valid = re.test(email);
        if (!valid) {
            this.showError(player, "Invalid Email");
        }
        return valid;
    }

    async checkUsername(player, obj) {
        const data = JSON.parse(obj);
        const d = await misc.query(`SELECT firstName, lastName FROM users WHERE firstName = '${data.firstName}' AND lastName = '${data.lastName}' LIMIT 1`);
        if (d[0]) {
            return this.showError(player, "This nickname already exists");
        }
        player.call("cInjectCef", [`app.setNameAvailable();`]);
    }

    async tryCreateAccount(player, obj) {
        const data = JSON.parse(obj);
        //console.log(data);
        const isEmailValid = this.isEmailValid(player, data.email);
        if (!isEmailValid) return;
        const d = await misc.query(`SELECT email FROM users WHERE email = '${data.email}' LIMIT 1`);
        if (d[0]) {
            return this.showError(player, "Something wrong. Try again");
        }
        this.createAccount(player, data);
    }

    async createAccount(player, d) {
        const newPass = this.hashPassword(d.pass);
        const firstSpawn = { x: -164, y: 6426, z: 32, }
        const pos = misc.convertOBJToJSON(firstSpawn, 48);
        /*let lang = 'eng';
        if (d.lang) lang = d.lang;*/

        const q1 = misc.query(`INSERT INTO users (email, firstName, lastName, password, ip, regdate, position, socialclub) 
                                    VALUES ('${d.email}', '${d.firstName}', '${d.lastName}', '${newPass}', '${player.ip}', '${new Date().toLocaleString()}', '${pos}', '${player.socialClub}')`);
        const q2 = money.createNewUser();
        const q3 = charCreator.createNewUser();
        const q4 = clothes.insertNewUser();
        const q5 = faction.insertNewUser();
        const q6 = headOverlay.insertNewUser();
        await Promise.all([q1, q2, q3, q4, q5, q6]);

        player.call("cInjectCef", [`app.showInfo('Success! Now you can log in.');`]);
        const mail = {
            from: `${mailer.getMailAdress()}`,
            to: `${d.email}`,
            subject: `Success registration.`,
            text: `Hello! Thank you for registration. Here is info about your account, in case you will forget it: FirstName: ${d.firstName} LastName: ${d.lastName} Password: ${d.pass}`,
            html: ` <b>Hello!</b><br>
                    Thank you for registration.<br>
                    Here is info about your account, in case you will forget it:<br>
                    <b>FirstName:</b> ${d.firstName}<br>
                    <b>LastName:</b> ${d.lastName}<br>
                    <b>Password:</b> ${d.pass}<br>`, 
        }
        //console.log(code);
        mailer.sendMail(mail);
        misc.log.debug(`New Account: ${d.email} | ${d.firstName} ${d.lastName}`);
    }

    hashPassword(str) {
        const cipher = crypto.createCipher('aes192', 'a pass');
        let encrypted = cipher.update(str, 'utf8', 'hex'); 
        encrypted += cipher.final('hex');
        return encrypted;
    }

    isAlreadyPlaying(email) {
        const players = mp.players.toArray();
        for (let player of players) {
            if (!player.loggedIn || player.basic.email !== email) continue;
            return true;
        }
        return false;
    }

    async tryLoginWithoutCode(player, obj) {
        const data = JSON.parse(obj);
        const pass = this.hashPassword(data.pass);
        const d = await misc.query(`SELECT id, email, password, ip FROM users WHERE email = '${data.email}' LIMIT 1`);
        if (!d[0]) {
            return this.showError(player, "This account doesnt exist");
        }
        else if (d[0].ip !== player.ip) {
            return player.call("cInjectCef", [`app.showCode = true;`]);
        }
        else if (d[0].password !== pass) {
            return this.showError(player, `Wrong password!`);
        }
        else if (this.isAlreadyPlaying(d[0].email)) {
            this.showError(player, `You cant log in from two devices!`);
            return player.kick('Dublicate');
        }
        this.loadAccount(player, d[0].id);
    }

    async tryGetCodeToLogin(player, email) {
        const isEmailValid = this.isEmailValid(player, email);
        if (!isEmailValid) return;
        this.trySendCode(player, email);
    }

    async tryValidateCodeAndLogIn(player, obj) {
        const data = JSON.parse(obj);
        const pass = this.hashPassword(data.pass);
        if (player.verificationCode !== data.code) {
            return this.showError(player, `Wrong code!`);
        }
        const d = await misc.query(`SELECT id, email, password FROM users WHERE email = '${data.email}' LIMIT 1`);
        if (!d[0]) {
            return this.showError(player, "This account doesnt exist");
        }
        else if (d[0].password !== pass) {
            player.call("cInjectCef", [`app.showCode = false; app.enteredCode = "";`]);
            return this.showError(player, `Wrong password!`);
        }
        else if (this.isAlreadyPlaying(d[0].email)) {
            this.showError(player, `You cant log in from two devices!`);
            return player.kick('Dublicate');
        }
        this.loadAccount(player, d[0].id);
    }

    async loadAccount(player, id) {
        await this.loadBasicData(player, id);
        player.call("cCloseCefAndDestroyCam");
        const q1 = money.loadUser(player);
        const q2 = charCreator.loadPlayerBody(player);
        const q3 = vehicleAPI.loadPlayerVehicles(player.basic.id);
        const q4 = faction.loadPlayerAccount(player);
        const q5 = headOverlay.loadPlayerHeadOverlay(player);
        const q6 = clothes.loadPlayerClothes(player);
        await Promise.all([q1, q2, q3, q4, q5, q6]);
        hospital.loadPlayerAccount(player);
        player.outputChatBox(`${i18n.get('sLogin', 'annouceChooseLang', player.lang)}`);
        player.outputChatBox(`${i18n.get('sLogin', 'annouceSpawnVehicle', player.lang)}`);
        player.outputChatBox(`${i18n.get('sLogin', 'annouceGlobalChat', player.lang)}`);
        player.outputChatBox(`${i18n.get('sLogin', 'annouceOldUser', player.lang)}`);
        const onlinePlayers = mp.players.toArray();
        if (onlinePlayers.length < 30) mp.players.broadcast(`[${time.getTime()}] ${player.name} ${i18n.get('sLogin', 'connected', player.lang)}`);
    }

    async loadBasicData(player, id) {
        const d = await misc.query(`SELECT * FROM users WHERE id = '${id}' LIMIT 1`);
        player.loggedIn = true;
        player.canOpen = {};
        player.canEnter = {};
        player.activeJob = {};
        player.lang = d[0].lang;
        player.basic = {
            id: d[0].id,
            email: d[0].email,
            firstName: d[0].firstName,
            lastName: d[0].lastName,
            adminlvl: d[0].adminlvl,
            loyality: d[0].loyality,
        }
        misc.updateName(player);
        misc.setPlayerPosFromJSON(player, d[0].position);
        player.dimension = d[0].dim;
        player.health = d[0].health;

        misc.log.debug(`${player.name} logged in`);
    }

    saveAccount(player) {
        this.saveBasicData(player);
        vehicleAPI.savePlayerVehicles(player.basic.id);
        const onlinePlayers = mp.players.toArray();
        if (onlinePlayers.length < 30) mp.players.broadcast(`[${time.getTime()}] ${player.name} [${i18n.get('sLogin', 'disconnected', player.lang)}]`);
        misc.log.debug(`${player.name} disconnected`);
    }

    saveBasicData(player) {
        const pos = misc.convertOBJToJSON(player.position, player.heading, 0.1);
        misc.query(`UPDATE users SET    ip = '${player.ip}', 
                                        logdate = '${new Date().toLocaleString()}', 
                                        position = '${pos}', 
                                        dim = '${player.dimension}', 
                                        health = '${player.health}', 
                                        loyality = '${player.basic.loyality}'
                                        WHERE id = '${player.basic.id}'`);
    }
}

const login = new loginClass();


mp.events.addCommand({
    'save' : (player) => {
        if (misc.getAdminLvl(player) < 1) return;
        login.saveAccount(player);
        player.outputChatBox(`${i18n.get('sLogin', 'saveGame', player.lang)}`);
    }, 
    
    'pos' : (player, fullText, model) => { 
        if (misc.getAdminLvl(player) < 1) return;
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
    
});   
