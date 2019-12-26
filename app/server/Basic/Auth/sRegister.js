

const misc = require('../../sMisc');
const mailer = require('../../sMailer');
const playerSingleton = require('../sPlayer');
const AbstractAuth = require('./sAuthAbstract');
const moneySingleton = require('../Money/sMoney');
const characterSingleton = require('../../Character/sCharacterCreator');
const clothesSingleton = require('../../Character/sClothes');
const headOverlaySingleton = require('../../Character/sHeadOverlay');
const faction = require('../../Factions/sFaction');
const prison = require('../../Factions/Police/Prison/sPrison');


class RegiserSingleton extends AbstractAuth {

    async tryGetCodeToRegister(player, email) {
        if (!mailer.isEmailValid(email)) {
            return this.showError(player, "Email Invalid");
        }
        const d = await misc.query(`SELECT email FROM users WHERE email = '${email}' LIMIT 1`);
        if (d[0]) {
            return this.showError(player, "This email already exists");
        }
        // this.trySendCode(player, email);
        player.call("cInjectCef", [`app.setMailChecked();`]);
    }

    trySendCode(player, email) {
        player.email = email;
        if (!player.verificationDate) {
            return this.sendCode(player, email);
        }
        const lastGetCodeTime = ((new Date().getTime() - player.verificationDate) / 1000).toFixed();
        if (lastGetCodeTime < 60) {
            return this.showError(player, `Wait ${60 - lastGetCodeTime} seconds`);
            
        }
        this.sendCode(player, email);
    }

    tryValidateCode(player, code) {
        if (!this.checkCode(player, code)) return;
        player.call("cInjectCef", [`app.setMailChecked();`]);
    }

    async checkUsername(player, obj) {
        const data = JSON.parse(obj);
        if (!data.firstName || !data.lastName) {
            return this.showError(player, "You cant own empty username");
        }
        const d = await misc.query(`SELECT firstName, lastName FROM users WHERE firstName = '${data.firstName}' AND lastName = '${data.lastName}' LIMIT 1`);
        if (d[0]) {
            return this.showError(player, "This nickname already exists");
        }
        player.call("cInjectCef", [`app.setNameAvailable();`]);
    }

    async tryCreateAccount(player, obj) {
        const data = JSON.parse(obj);
        if (!mailer.isEmailValid(data.email)) {
            return this.showError(player, "Email Invalid");
        }
        const d = await misc.query(`SELECT email FROM users WHERE email = '${data.email}' LIMIT 1`);
        if (d[0]) {
            return this.showError(player, "Something wrong. Try again");
        }
        this.createAccount(player, data);
    }

    async createAccount(player, d) {
        const pass = this.hashPassword(d.pass);
        await playerSingleton.createNewUser(player, d.email, d.firstName, d.lastName, pass);
        const data = await misc.query(`SELECT id FROM users ORDER BY id DESC LIMIT 1`);
        const q1 = moneySingleton.createNewUser(data[0].id);
        const q2 = characterSingleton.createNewUser(data[0].id);
        const q3 = clothesSingleton.createNewUser(data[0].id);
        const q4 = headOverlaySingleton.createNewUser(data[0].id);
        const q5 = faction.createNewUser(data[0].id);
        const q6 = prison.createNewUser(data[0].id);
        
        await Promise.all([q1, q2, q3, q4, q5, q6]);

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
        // mailer.sendMail(mail);
        player.call("cInjectCef", [`app.showInfo('Success! Now you can log in.');`]);
    }
    
}
const regiserSingleton = new RegiserSingleton();

mp.events.add({
    "playerReady" : async (player) => {
        player.spawn(new mp.Vector3(3222, 5376, 20));
        player.dimension = 1001;
        playerSingleton.loadPlayerTemplate(player);
        player.call("cLogin-ShowLoginWindow");
    },

    "sRegister-TryGetCodeToRegister" : async (player, email) => {
        regiserSingleton.tryGetCodeToRegister(player, email);
    },

    "sRegister-TryValidateEmailWithCode" : async (player, code) => {
        regiserSingleton.tryValidateCode(player, code);
    },

    "sRegister-CheckUsername" : async (player, obj) => {
        regiserSingleton.checkUsername(player, obj);
    },

    "sRegister-CreateAccount" : async (player, obj) => {
        regiserSingleton.tryCreateAccount(player, obj);
    },

});