mp.events.add({
	"cGPS-CreateRoute" : (x, y) => {
		mp.game.ui.setNewWaypoint(x, y);
	},
	
});