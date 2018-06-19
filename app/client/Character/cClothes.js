"use strict"

const misc = require('../cMisc');
const player = mp.players.local;


mp.events.add(
{
    "cClothesSetCloth" : (obj) => {
        mp.events.callRemote("sClothesSetCloth", obj);
    },

   

  
});       


