let cef = null;
let camera = null;
const player = mp.players.local;

function prettify(num) {
    const n = num.toString();
    const separator = " ";
    return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, `$1${separator}`);
}
exports.prettify = prettify;

const roundNum = (number, ends = 0) => parseFloat(number.toFixed(ends))
exports.roundNum = roundNum;

// CEF //
function prepareToCef(blurred = null) {
	mp.gui.cursor.visible = true;
	mp.game.ui.displayRadar(false);
	mp.gui.chat.show(false);
	if (blurred) mp.game.graphics.transitionToBlurred(blurred);
}
exports.prepareToCef = prepareToCef;


function injectCef(execute) {
	if(!cef) return;
	cef.execute(execute);
}
exports.injectCef = injectCef;


function openCef(url, lang = "eng") {
	if (cef) cef.destroy();
	cef = mp.browsers.new(url);
	if (lang === "rus") injectCef("loadRusLang();"); 
	else if (lang === "ger") injectCef("loadGerLang();");
	else if (lang === "br") injectCef("loadBrLang();");
	else if (lang === "zhs") injectCef("loadZhsLang();");
	else if (lang === "zht") injectCef("loadZhtLang();");
	else if (lang === "cs") injectCef("loadCsLang();");
}
exports.openCef = openCef;


function closeCef() {
	if (cef) {
		cef.destroy(); 
		cef = null;
	}
	mp.gui.cursor.visible = false;
	mp.game.ui.displayRadar(true);
	mp.gui.chat.show(true);
	mp.game.graphics.transitionFromBlurred(1);
}
exports.closeCef = closeCef;
// CEF //

// CAMERA //
function createCam(x, y, z, rx, ry, rz, viewangle) {
	camera = mp.cameras.new("Cam", {x, y, z}, {x: rx, y: ry, z: rz}, viewangle);
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
	"cInjectCef" : execute => injectCef(execute),
	"cCloseCef" : () => closeCef(),
	"cDestroyCam" : () => destroyCam(),

	"cCloseCefAndDestroyCam" : () => {
		closeCef();
		destroyCam();
	},

	"cChangeHeading" : angle => player.setHeading(angle),

	"cMisc-CreateChooseWindow" : (lang, execute, confirmEvent, rejectEvent) => {
		prepareToCef(500);
		openCef("package://RP/Browsers/Misc/chooseWindow.html", lang);
		const str1 = `app.confirmEvent = '${confirmEvent}';`;
		const str2 = `app.rejectEvent = '${rejectEvent}';`;
		const inject = execute + str1+ str2;
		injectCef(inject);
	},

	"cMisc-CallServerEvent" : (eventName, id, price) => mp.events.callRemote(eventName, id, price),

	"cMisc-CallServerEvenWithTimeout" : (eventName, timeout) => {
		setTimeout(() => {
			mp.events.callRemote(eventName);
		}, timeout);
	}
	
});
	
