const crypto = require('crypto');
const misc = require('../sMisc');
const vehicleAPI = require('./Vehicles/sVehicleSingletone');
const i18n = require('../sI18n');
const mailer = require('../sMailer');


class Menu {
    constructor() {
        mp.events.add({
            "sKeys-M" : (player) => {
                if (!player.loggedIn) return;
                let execute = `app.d.cash = ${player.money.cash};`;
                execute += `app.pName = '${player.name}';`;
                execute += `app.d.loyality = ${player.loyality};`;
                if (player.vehicle) execute += `app.d.currentVehicleId = ${player.vehicle.id};`;
                execute += `app.loadVehicles('${vehicleAPI.getVehiclesForPlayerMenu(player.guid)}');`;
                execute += `app.loadPassengers('${vehicleAPI.getPassengersForPlayerMenu(player)}');`;
                execute += `app.loadViolations('${JSON.stringify(player.jail.violations)}');`;
                player.call("cMenu-Open", [player.lang, execute]);
                misc.log.debug(`${player.name} opens menu`);
            },
            
            "sMenu-SetLang" : (player, id) => {
                const languages = ['eng', 'rus', 'ger', 'br', 'zhs', 'zht', 'cs',];
                const lang = languages[id];
                if (!lang) return;
                player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
                misc.query(`UPDATE users SET lang = '${lang}' WHERE id = '${player.guid}'`);
                player.lang = lang;
            },
            
            "sMenu-ChangePass" : async (player, str) => {
                const d = JSON.parse(str);
                const db = await misc.query(`SELECT password FROM users WHERE id = '${player.guid}' LIMIT 1`);
                const oldPass = this.hashPassword(d.oldPass);
                if (oldPass !== db[0].password) return player.notify(`~r~${i18n.get('sMenu', 'wrongOldPass', player.lang)}!`);
                const newPass = this.hashPassword(d.newPass);
                await misc.query(`UPDATE users SET password = '${newPass}' WHERE id = '${player.guid}' LIMIT 1`);
                const mail = {
                    from: `${mailer.getMailAdress()}`,
                    to: `${player.email}`,
                    subject: `Password has been changed`,
                    text: `Hello! Your new password is: ${d.newPass}`,
                    html: `<b>Hello!</b><br>Your new password is: ${d.newPass}`,
                }
                mailer.sendMail(mail);
                player.notify(`~g~${i18n.get('basic', 'success', player.lang)}!`);
            },
            
            "sMenu-RestoreVehicle" : async (player, id) => {
                const vehicle = mp.vehicles.at(id);
                if (!vehicle || vehicle.ownerId !== player.guid) return;
                vehicle.position = new mp.Vector3(417.153, -1627.647, 28.857);
                vehicle.rotation.z = 240;
                vehicle.repair();
                vehicle.locked = true;
                vehicle.engine = false;
                player.newFine(vehicle.info.price / 5, `911 call for ${vehicle.title}`);
			},

        });
    }

    hashPassword(str) {
        const cipher = crypto.createCipher('aes192', 'a pass');
        let encrypted = cipher.update(str, 'utf8', 'hex'); 
        encrypted += cipher.final('hex');
        return encrypted;
    }
    
}
new Menu();
