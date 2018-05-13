"use strict"

const player = mp.players.local;


mp.keys.bind(69, false, function() {     // E
    mp.events.callRemote('sKeys-E');
});