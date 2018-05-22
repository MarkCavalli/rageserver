"use strict"

const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const clothes = require('../Character/sClothes');

const treeMarkersList = [];
let menuShape, dropMarker, dropShape;
const checkPoints = [
    {x: 378.583, y: 6517.85, z: 27.7 },
    {x: 378.304, y: 6506.14, z: 27.7 },
    {x: 370.188, y: 6506.349, z: 27.7 },
    {x: 370.455, y: 6517.792, z: 27.7 },
    {x: 368.892, y: 6531.863, z: 27.7 },
    {x: 362.015, y: 6531.501, z: 27.7 },
    {x: 363.063, y: 6517.922, z: 27.7 },
    {x: 363.256, y: 6506.289, z: 27.7 },
    {x: 354.857, y: 6504.864, z: 27.7 },
    {x: 355.179, y: 6516.821, z: 27.7 },
    {x: 354.111, y: 6530.424, z: 27.7 },
    {x: 345.973, y: 6530.799, z: 27.7 },
    {x: 347.625, y: 6517.124, z: 27.7 },
    {x: 348.232, y: 6505.646, z: 27.7 },
    {x: 340.024, y: 6505.893, z: 27.7 },
    {x: 338.755, y: 6517.642, z: 27.7 },
    {x: 338.543, y: 6530.713, z: 27.7 },
    {x: 329.836, y: 6531.433, z: 27.7 },
    {x: 329.830, y: 6517.543, z: 27.7 },
    {x: 330.540, y: 6506.052, z: 27.7 },
    {x: 321.837, y: 6504.873, z: 27.7 },
    {x: 321.420, y: 6517.296, z: 27.7 },
    {x: 321.355, y: 6530.995, z: 27.7 },
];



function createEntities() {
	const mainMenu =  {x: 405.676, y: 6526.119, z: 27.709};
    const posToDrop = {x: 331.74, y: 6541.576, z: 28.417};
	
	// mainMenu
	const menuMarker = mp.markers.new(1, new mp.Vector3(mainMenu.x, mainMenu.y, mainMenu.z - 1), 0.75,
	{
		color: [0, 255, 0, 100],
		visible: true,
	});
	menuShape = mp.colshapes.newSphere(mainMenu.x, mainMenu.y, mainMenu.z, 1);

	const blip = mp.blips.new(501, new mp.Vector3(mainMenu.x, mainMenu.y, mainMenu.z),
	{	
        name: "Orange Collector Job",
		shortRange: true,
		scale: 0.7,
		color: 17,
	});
	
	//dropMenu
	dropMarker = mp.markers.new(1, new mp.Vector3(posToDrop.x, posToDrop.y, posToDrop.z - 1), 0.75,
	{
		color: [255, 165, 0, 100],
		visible: true,
	});
	dropShape = mp.colshapes.newSphere(posToDrop.x, posToDrop.y, posToDrop.z, 1);

	
	for (let i = 0; i < checkPoints.length; i++) {
		const marker = mp.markers.new(1, new mp.Vector3(checkPoints[i].x, checkPoints[i].y, checkPoints[i].z - 1), 3,
		{
			color: [255, 165, 0, 50],
			visible: false,
        });
        marker.orangeCollectorTree = i;
		treeMarkersList.push(marker);
        const colshape = mp.colshapes.newSphere(checkPoints[i].x, checkPoints[i].y, checkPoints[i].z, 3);
        colshape.orangeCollectorTree = i;
    }
}

function openMainMenu(player) {
    if (player.info.activeJob.name === "Orange Collector") {
        return player.call("cOrangeCollectorFinishCef", ['app.loadFinish();']);
    }
    player.call("cOrangeCollectorStartCef");
}

function startWork(player) {
    player.info.activeJob = {
        name: "Orange Collector",
        collected: 0,
        activeTree: false,
    };
    createRandomCheckPoint(player);
    player.notify("~g~You started orange collector job!");
    misc.log.debug(`${player.name} started orange collector job!`);
    dropMarker.showFor(player);
    if (player.model === 1885233650) {
		setWorkingClothesForMan(player);
	}
	else {
		setWorkingClothesForWoman(player);
	}

    function setWorkingClothesForMan(player) {
        player.setProp(0, 14, 0); //Hat
        player.setClothes(11, 78, misc.getRandomInt(0, 15), 0); //Top
        player.setClothes(3, 14, 0, 0);
        player.setClothes(252, 0, 0, 0);
        player.setClothes(4, 0, misc.getRandomInt(0, 15), 0); // Legs
    }
    function setWorkingClothesForWoman(player) {
        player.setProp(0, 14, 0); //Hat
        player.setClothes(11, 78, misc.getRandomInt(0, 7), 0); //Top
        player.setClothes(3, 9, 0, 0);
        player.setClothes(82, 0, 0, 0);
        player.setClothes(4, 1, misc.getRandomInt(0, 15), 0); // Legs
    }
}

function createRandomCheckPoint(player) {
   
    const i = misc.getRandomInt(0, checkPoints.length - 1)
    if (i === player.info.activeJob.activeTree) {
		return createRandomCheckPoint(player);
    }
    hideActiveCheckPoint(player);
    treeMarkersList[i].showFor(player);
    player.info.activeJob.activeTree = i;
    return i;
}

function enteredTreeShape(player) {
    player.stopAnimation();
    player.info.activeJob.collected += misc.getRandomInt(1, 2);
    player.notify(`You have ~g~${player.info.activeJob.collected} ~w~oranges in your bucket!`);
    if (player.info.activeJob.collected < 20) {
        return createRandomCheckPoint(player);
    }
    hideActiveCheckPoint(player);
    player.notify("~g~Your bucket is full! Take it to the trailer!");
}


function hideActiveCheckPoint(player) {
    if (typeof player.info.activeJob.activeTree !== "number") return;
    const i = player.info.activeJob.activeTree;
    treeMarkersList[i].hideFor(player);
    player.info.activeJob.activeTree = false;
}


function enteredDropShape(player) {
    player.stopAnimation();
    if (player.info.activeJob.collected === 0) {
        return player.notify(`Your bucket is empty!`);
    }
    const earnedMoney = player.info.activeJob.collected * 5;
    moneyAPI.changeMoney(player, earnedMoney);
    player.notify(`You earned ~g~${earnedMoney}$! ~w~Keep it up!`);
    misc.log.debug(`${player.name} earned ${earnedMoney}$!`);
    player.info.activeJob.collected = 0;
    if (!player.info.activeJob.activeTree) {
        createRandomCheckPoint(player);
    }
}

function finishWork(player) {
    hideActiveCheckPoint(player);
    player.info.activeJob = {
        name: false,
    };
    player.notify("~g~You finished orange collector job!");
    misc.log.debug(`${player.name} finished orange collector job!`);
    dropMarker.hideFor(player);
    clothes.loadPlayerClothes(player);
}




mp.events.add(
{
    "playerEnterColshape" : (player, shape) => {
        if (player.vehicle || !player.info) return;
        if (shape === menuShape) {
            player.info.canOpen.orangeCollector = true;
            player.notify(`Press ~b~E ~s~to open Menu`);
        }
        else if (player.info.activeJob.name === "Orange Collector" && shape.orangeCollectorTree === player.info.activeJob.activeTree) {
            player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
            setTimeout(enteredTreeShape, 2400, player);
        }
        else if (shape === dropShape && player.info.activeJob.name === "Orange Collector") {
            player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
            setTimeout(enteredDropShape, 2400, player);
        }
    },

    "playerExitColshape" : (player, shape) => {
        if (shape === menuShape) {
            return player.info.canOpen.orangeCollector = false;
        }
    },
    
    "sKeys-E" : (player) => {
        if (!player.info || !player.info.loggedIn || !player.info.canOpen.orangeCollector) return;
        if (player.info.activeJob.name && player.info.activeJob.name !== "Orange Collector") {
            return player.nofity("You are already working on some job!");
        }
        openMainMenu(player);
    },

    "sOrangeCollectorStartWork" : (player) => {
        startWork(player);
    },

    "sOrangeCollectorFinishWork" : (player) => {
        finishWork(player);
    },

});






createEntities();