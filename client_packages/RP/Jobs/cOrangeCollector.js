"use strict"

const misc = require('/RP/cMisc');
const player = mp.players.local;


mp.events.add(
{
   
    "cOrangeCollectorStartWork" : () => {
        mp.events.callRemote('sOrangeCollectorStartWork');
    },

    "cOrangeCollectorOpenCef" : (lang, inject) => {
        misc.prepareToCef();
        misc.openCef("package://RP/Browsers/Jobs/OrangeCollector/collector.html", lang);
        misc.injectCef(inject);
    },

    "cOrangeCollectorFinishWork" : () => {
        mp.events.callRemote('sOrangeCollectorFinishWork');
    },
    
});       


