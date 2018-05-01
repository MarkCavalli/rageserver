"use strict"

let cef = null;
let camera = null;



// CEF //
function prepareToCef(blurred) {
	mp.gui.cursor.visible = true;
	mp.game.ui.displayRadar(false);
	mp.gui.chat.show(false);
	if (blurred) {
		mp.game.graphics.transitionToBlurred(blurred);
	}
}
exports.prepareToCef = prepareToCef;

function openCef(url) {
	if (cef) {
		cef.destroy(); 
	}
	cef = mp.browsers.new(url);
}
exports.openCef = openCef;

function injectCef(execute) {
	if(!cef) {
		return console.log(`injectCef = ${cef}`);
	}
	cef.execute(execute);
}
exports.injectCef = injectCef;

function closeCef() {
	if (cef) {
		cef.destroy(); 
		cef = null;
	}
	mp.gui.cursor.visible = false;
	mp.game.ui.displayRadar(true);
	mp.gui.chat.show(true);
	mp.game.graphics.transitionFromBlurred(500);
}
exports.closeCef = closeCef;
// CEF //


// CAMERA //
function createCam(x, y, z, rx, ry, rz, viewangle) {
	camera = mp.cameras.new("Cam", {x: x, y: y, z: z}, {x: rx, y: ry, z: rz}, viewangle);
	camera.setActive(true);
	mp.game.cam.renderScriptCams(true, true, 20000000000000000000000000, false, false);
}
exports.createCam = createCam;

function destroyCam() {
	if (!camera) return;
	camera.setActive(false);
	mp.game.cam.renderScriptCams(false, true, 0, true, true);
	camera.destroy();
	camera = null;
}
exports.destroyCam = destroyCam;
// CAMERA //




mp.events.add(
	{		
		"cInjectCef" : (execute) => {
			console.log(execute);
			injectCef(execute);
		},

		"cCloseCef" : () => {
			closeCef();
		},

		"cDestroyCam" : () => {
			destroyCam();
		},
		
		"cCloseCefAndDestroyCam" : () => {
			closeCef();
			destroyCam();
		},
		
	
	});
	