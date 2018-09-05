mp.events.add(
{
	"cPrison-SetWantedLevel" : l => mp.game.gameplay.setFakeWantedLevel(l),

	"cPrison-SendNotification" : (message) => {
		const maxStringLength = 99;
		mp.game.ui.setNotificationTextEntry("CELL_EMAIL_BCON");
		for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength) mp.game.ui.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
		mp.game.ui.setNotificationMessage("CHAR_CALL911", "CHAR_CALL911", false, 0, 'LS POLICE', `New violation`);
		mp.game.ui.drawNotification(false, true);
	},
});
