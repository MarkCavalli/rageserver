"use strict";

const misc = require('../cMisc');

mp.events.add({
    "cMariaCollector-OpenMainMenu" : (lang, inject) => {
        misc.prepareToCef();
        misc.openCef("package://RP/Browsers/Jobs/MariaCollector/mariacollector.html", lang);
        misc.injectCef(inject);
    },
});       