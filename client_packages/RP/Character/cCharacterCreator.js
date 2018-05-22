"use strict"

const misc = require('/RP/cMisc');
const player = mp.players.local;


mp.events.add(
{
    "cCharCreatorStart" : () => {
        misc.prepareToCef();
	    misc.createCam(402.6, -998.75, -98.32, 0, 0, 358, 15);
	    misc.openCef("package://RP/Browsers/Character/first.html");
    },

    "cCharCreatorChangeGender" : (gender) => {
        mp.events.callRemote('sCharCreatorChangeGender', gender);
    },


    "cCharCreatorUpdateSkinOptions" : (strJSON) => {
        const skindata = JSON.parse(strJSON);
        player.setHeadBlendData(skindata[0], skindata[1], 0, skindata[2], 0, 0, skindata[3], 0, 0, false);
    },

    "cCharCreatorSaveSkinOptions" : (strJSON) => {
        mp.events.callRemote('sCharCreatorSaveSkinOptions', strJSON);
        misc.openCef("package://RP/Browsers/Character/second.html");
    },

    "cCharCreatorUpdateFaceOptions" : (strJSON) => {
        const facedata = JSON.parse(strJSON);
        for (let i = 0; i < facedata.length; i++) {
            player.setFaceFeature(i, facedata[i]);
        }
    },

    "cCharCreatorSaveFaceOptions" : (strJSON) => {
        mp.events.callRemote('sCharCreatorSaveFaceOptions', strJSON);
    },
});       


