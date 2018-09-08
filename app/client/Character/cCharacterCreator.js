const misc = require('../cMisc');

const player = mp.players.local;

mp.events.add({
    "cCharCreator-OpenMenu" : () => {
        misc.prepareToCef();
        misc.createCam(402.6, -998.75, -98.32, 0, 0, 358, 15);
        misc.openCef("package://RP/Browsers/Character/first.html");
    },

    "cCharCreator-UpdateSkinOptions" : (strJSON) => {
        const skindata = JSON.parse(strJSON);
        player.setHeadBlendData(skindata[0], skindata[1], 0, skindata[2], 0, 0, skindata[3], 0, 0, false);
    },

    "cCharCreator-LoadWindowTwo" : () => misc.openCef("package://RP/Browsers/Character/second.html"),

    "cCharCreator-UpdateFaceOptions" : (strJSON) => {
        const facedata = JSON.parse(strJSON);
        for (let i = 0; i < facedata.length; i++) {
            player.setFaceFeature(i, facedata[i]);
        }
    },
});
