"use strict";

const misc = require('../cMisc');

let deliveryPointsListClient = [];

let blip = [];

mp.events.add({
    "cCluckinBellCourier-OpenMainMenu": (lang, inject) => {
        misc.prepareToCef();
        misc.openCef("package://RP/Browsers/Jobs/CluckinBellCourier/cluckinbellcourier.html", lang);
        misc.injectCef(inject);
    },

    "createCluckinBellBlip": (i) => {
        deliveryPointsListClient = [];
        for (const pos of i) {
            const blip = mp.blips.new(1, new mp.Vector3(pos.x, pos.y, pos.z), {
                name: 'Entrega',
                shortRange: true,
                scale: 0.7,
                color: 60,
                alpha: 0,                
            });
            const obj = { blip }
            deliveryPointsListClient.push(obj);
        }

        mp.events.callRemote('sCluckinBellCourier-NewOrderFromClient');      
    },

    "unrouteCluckinBellBlip": (i) => {
        deliveryPointsListClient[i].blip.alpha = 0;
        deliveryPointsListClient[i].blip.setDisplay(0);
        deliveryPointsListClient[i].blip.setRoute(false);
        blip.destroy();
    },

    "routeCluckinBellBlip": (pos) => {
        blip = mp.blips.new(1, new mp.Vector3(pos.x, pos.y, pos.z), {
                name: 'Entrega',
                shortRange: true,
                scale: 0.7,
                color: 60,
                alpha: 255,
        });

        blip.setRoute(true);
    },
});       