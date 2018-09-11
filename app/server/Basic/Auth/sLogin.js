
const misc = require('../../sMisc');
const mailer = require('../../sMailer');
const i18n = require('../../sI18n');
const playerSingleton = require('../sPlayer');
const AbstractAuth = require('./sAuthAbstract');



class LoginSingleton extends AbstractAuth {
    async tryLoginWithoutCode(player, obj) {
        const data = JSON.parse(obj);
        const pass = this.hashPassword(data.pass);
        const d = await misc.query(`SELECT id, email, password, socialclub FROM users WHERE email = '${data.email}' LIMIT 1`);
        if (!d[0]) {
            return this.showError(player, "This account does NOT exist");
        }
        if (d[0].socialclub !== player.socialClub) {
            return player.call("cInjectCef", [`app.showCode = true;`]);
        }
        if (d[0].password !== pass) {
            return this.showError(player, `Wrong password!`);
        }
        else if (this.isAlreadyPlaying(d[0].email)) {
            this.showError(player, `You cant log in from two devices!`);
            player.loggedIn = false;
            return player.kick('Dublicate');
        }
        this.loadAccount(player, d[0].id);
    }

    isAlreadyPlaying(email) {
        const players = mp.players.toArray();
        for (const player of players) {
            if (!player.loggedIn) continue;
            if (player.email === email) return true;
        }
        return false;
    }

    async loadAccount(player, id) {
        delete player.verificationCode;
        delete player.verificationDate;
        delete player.verificationCodeTries;

        await playerSingleton.loadAccount(player, id);

        player.outputChatBox(`${i18n.get('sLogin', 'annouceSpawnVehicle', player.lang)}`);
        player.outputChatBox(`${i18n.get('sLogin', 'annouceGlobalChat', player.lang)}`);
        player.outputChatBox(`${i18n.get('sLogin', 'annouceOldUser', player.lang)}`);
        player.outputChatBox(`${i18n.get('sLogin', 'annoucePlayerMenu', player.lang)}`);
        const onlinePlayers = mp.players.toArray();
        if (onlinePlayers.length < 30) {
            for (const p of onlinePlayers) {
                p.outputChatBox(`[${misc.getTime()}] ${player.name} ${i18n.get('sLogin', 'connected', p.lang)}`);
            }
        }
    }

    tryGetCodeToLogin(player, email) {
        if (!mailer.isEmailValid(email)) {
            return this.showError(player, "Email Invalid");
        }
        this.trySendCode(player, email);
    }

    async tryValidateCodeAndLogIn(player, obj) {
        const data = JSON.parse(obj);
        const pass = this.hashPassword(data.pass);
        if (!this.checkCode(player, data.code)) return;
        const d = await misc.query(`SELECT id, email, password FROM users WHERE email = '${data.email}' LIMIT 1`);
        if (!d[0]) {
            return this.showError(player, "This account does NOT exist");
        }
        if (d[0].password !== pass) {
            player.call("cInjectCef", [`app.showCode = false; app.enteredCode = "";`]);
            return this.showError(player, `Wrong password!`);
        }
        if (this.isAlreadyPlaying(d[0].email)) {
            this.showError(player, `You cant log in from two devices!`);
            return player.kick('Dublicate');
        }
        this.loadAccount(player, d[0].id);
    }

}
const loginSingleton = new LoginSingleton();

mp.events.add({
    "sLogin-TryLoginWithoutCode" : async (player, obj) => {
        loginSingleton.tryLoginWithoutCode(player, obj);
    },

    "sLogin-TryGetCodeToLogin" : async (player, email) => {
        loginSingleton.tryGetCodeToLogin(player, email);
    },

    "sLogin-TryValidateCodeAndLogIn" : async (player, obj) => {
        loginSingleton.tryValidateCodeAndLogIn(player, obj);
    },

    "playerQuit" : (player) => {
        if (!player.loggedIn) return;
        playerSingleton.saveAccount(player);
        const onlinePlayers = mp.players.toArray();
        if (onlinePlayers.length < 30) {
            for (const p of onlinePlayers) {
                p.outputChatBox(`[${misc.getTime()}] ${player.name} ${i18n.get('sLogin', 'disconnected', p.lang)}`);
            }
        } 
    },
});