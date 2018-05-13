"use strict"

const misc = require('/RP/cMisc');
const player = mp.players.local;


mp.events.add(
{
    "cOrangeCollectorStartCef" : () => {
        misc.prepareToCef();
        misc.openCef("package://RP/Browsers/Jobs/OrangeCollector/collector.html");
    },

    "cOrangeCollectorStartWork" : () => {
        mp.events.callRemote('sOrangeCollectorStartWork');
    },

    "cOrangeCollectorFinishCef" : (inject) => {
        misc.prepareToCef();
        misc.openCef("package://RP/Browsers/Jobs/OrangeCollector/collector.html");
        misc.injectCef(inject);
    },

    "cOrangeCollectorFinishWork" : () => {
        mp.events.callRemote('sOrangeCollectorFinishWork');
    },
    
});       


