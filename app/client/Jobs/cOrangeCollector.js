"use strict";

const misc = require('../cMisc');

mp.events.add({
    "cOrangeCollector-OpenMainMenu" : (lang, inject) => {
        misc.prepareToCef();
        misc.openCef("package://RP/Browsers/Jobs/OrangeCollector/collector.html", lang);
        misc.injectCef(inject);
    },
});       