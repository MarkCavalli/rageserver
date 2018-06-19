"use strict"

const player = mp.players.local;


mp.keys.bind(69, false, function() {     // E
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-E');
});

mp.keys.bind(96, false, function() {     // Num 0
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num0');
});

mp.keys.bind(100, false, function() {     // Num 4
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num4');
});

mp.keys.bind(101, false, function() {     // Num 5
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num5');
});

mp.keys.bind(102, false, function() {     // Num 6
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num6');
});

mp.keys.bind(103, false, function() {     // Num 7
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num7');
});

mp.keys.bind(104, false, function() {     // Num 8
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num8');
});

mp.keys.bind(105, false, function() {     // Num 9
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num9');
});