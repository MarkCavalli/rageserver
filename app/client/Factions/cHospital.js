
const misc = require('../cMisc');

mp.events.add(
{
	"render" : () => drawLightInHospital(),
	"cHospital-DisableHealthRegeneration" : () => mp.game.player.setHealthRechargeMultiplier(0.0),

	"cHospital-ShowDoctorMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RP/Browsers/Factions/Hospital/interactiveMenu.html", lang);
		misc.injectCef(inject);
	},

});

// This need to be reworked.
function drawLightInHospital() {
	mp.game.graphics.drawLightWithRange(273.552, -1359.888, 26.538, 255, 255, 255, 10, 3);
	mp.game.graphics.drawLightWithRange(267.438, -1354.475, 26.538, 255, 255, 255, 10, 3);
	mp.game.graphics.drawLightWithRange(264.446, -1360.933, 26.538, 255, 255, 255, 10, 3);
	mp.game.graphics.drawLightWithRange(260.973, -1355.263, 26.538, 255, 255, 255, 10, 3);
	mp.game.graphics.drawLightWithRange(258.704, -1358.373, 26.538, 255, 255, 255, 10, 3);
	mp.game.graphics.drawLightWithRange(253.371, -1364.243, 26.538, 255, 255, 255, 10, 3);
	mp.game.graphics.drawLightWithRange(266.289, -1349.066, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(269.465, -1345.382, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(272.605, -1341.442, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(277.381, -1344.953, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(281.043, -1347.922, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(287.233, -1340.630, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(263.554, -1344.159, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(258.473, -1339.332, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(257.234, -1346.424, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(255.189, -1349.291, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(247.997, -1351.431, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(245.483, -1354.224, 26.538, 255, 255, 255, 10, 2);
	mp.game.graphics.drawLightWithRange(253.495, -1356.144, 26.538, 255, 255, 255, 10, 2);
}
