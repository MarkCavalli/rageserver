"use strict"

const player = mp.players.local;


mp.keys.bind(69, false, function() {     // E
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-E');
});