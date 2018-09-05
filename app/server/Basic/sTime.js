const business = require('../Business/sBusiness');


class TimeSingleton {
	constructor() {
		this.timer = 0;
	}

	everyMinuteEvent() {
		const players = mp.players.toArray();
		for (const player of players) {
			if (!player.loggedIn) return;
			player.addHP();
			player.jailEvent();
		}	
	}

	every5MinutesEvent() {

	}

	everyHourEvent() {
		business.payTaxes();
	}

	runTimer(isFirstRunning) {
		const currentDate = new Date();
		const remainingMilliseconds = (60 - currentDate.getSeconds()) * 1000 + (1000 - currentDate.getMilliseconds());
		this.changeTime(currentDate, !!isFirstRunning);
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.runTimer();
		}, remainingMilliseconds);
	}

	changeTime(currentDate, isFirstRunning) {
		mp.world.time.hour = currentDate.getHours();
		mp.world.time.minute = currentDate.getMinutes();
		if (isFirstRunning) return false;
		this.everyMinuteEvent();
		if (currentDate.getMinutes() === 0) this.everyHourEvent();
		if (currentDate.getMinutes() % 5 === 0) this.every5MinutesEvent();	
	}

	getTime() {
		const currentTime = new Date();
		let h = currentTime.getHours();
		let m = currentTime.getMinutes();
		let s = currentTime.getSeconds();
		if (h < 10) h = `0${h}`;
		if (m < 10) m = `0${m}`;
		if (s < 10) s = `0${s}`;
		return `${h}:${m}:${s}`;
	}
}
const timeSingleton = new TimeSingleton();
timeSingleton.runTimer(true);
module.exports = timeSingleton;