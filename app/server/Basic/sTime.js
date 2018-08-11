"use strict"

const weather = require('./sWeather');
const business = require('./../Business/sBusiness');
const hospital = require('./../Factions/sHospital');
const prison = require('./../Factions/Police/sPrison');

let timer = 0;
const changeTime = async (currentDate, isFirstRunning) => {
	mp.world.time.hour = currentDate.getHours();
	mp.world.time.minute = currentDate.getMinutes();
	if (isFirstRunning) {
		return;
	}
	everyMinuteEvent();
	if (currentDate.getMinutes() === 0) {
		everyhourEvent();
	}
	if (currentDate.getMinutes() % 5 === 0) {
		every5MinutesEvent();
	}
};

const runTimer = (isFirstRunning) => {
	const currentDate = new Date();
	const remainingMilliseconds = (60 - currentDate.getSeconds()) * 1000 + (1000 - currentDate.getMilliseconds());
	changeTime(currentDate, !!isFirstRunning);
	clearTimeout(timer);
	timer = setTimeout(() => {
		runTimer();
	}, remainingMilliseconds);
};

runTimer(true);

function getTime() {
	const currentTime = new Date();
	let h = currentTime.getHours();
	let m = currentTime.getMinutes();
	let s = currentTime.getSeconds();
	if (h < 10) h = "0" +h;
	if (m < 10) m = "0" +m;
	if (s < 10) s = "0" +s;
	return `${h}:${m}:${s}`;
}
module.exports.getTime = getTime;

function everyhourEvent() {
	business.payTaxes();
}

function every5MinutesEvent() {
	weather.changeWeather();
}

function everyMinuteEvent() {
	hospital.healEvent();
	prison.everyMinuteEvent();
}