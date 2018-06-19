"use strict"

const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const loyality = require('../Basic/sLoyality');


let showInviteHRText, showUninviteHRText, alreadyHasJobText, cantGetNewOrderText, canGetNewOrderText, earnedText1, earnedText2,
 haveUndeliveredText, needMoreLoyalityText, startText, finishText, deliverText, undeliveredCommentText;
function updateLanguage(player) {
    showInviteHRText = `Press ~b~E ~s~to start work as a Delivery Men`;
    showUninviteHRText = `Press ~b~E ~s~to finish work as a Delivery Men`;
    alreadyHasJobText = `You are already working on some job!`;
    cantGetNewOrderText = `You can't get new order!`;
    canGetNewOrderText = `Press ~b~E ~s~to get a new order`;
    earnedText1 = `You earned`;
    earnedText2 = `Keep it up!`;
    haveUndeliveredText = `You have undelivered order! You will pay $500 finishing right now!`;
    needMoreLoyalityText = `You need at least 50 loyality points to start this job!`;
    startText = "You started Cluckin' Bell delivery job! You can get new order in the left side";
    finishText = "You finished Cluckin' Bell delivery job!";
    deliverText = "Deliver your order";
    undeliveredCommentText = "Undelivered order";

    const lang = misc.getPlayerLang(player);
	if (lang === "rus") {
        showInviteHRText = `Нажмите ~b~E~s~, чтобы устроиться курьером в Clickin' Bell`;
        showUninviteHRText = `Нажмите ~b~E~s~, чтобы уволиться из Clickin' Bell`;
        alreadyHasJobText = `Вы работаете на другой работе!`;
        cantGetNewOrderText = `Вы не можете взять другой заказ!`;
        canGetNewOrderText = `Нажмите ~b~E~s~, чтобы взять новый заказ!`;
        earnedText1 = `Вы заработали`;
        earnedText2 = `Продолжайте в том же духе!`;
        haveUndeliveredText = `У вас есть недоставленный заказ! Вам выпишут штраф $500, если вы уволитесь прямо сейчас!`;
        needMoreLoyalityText = `Вам необходимо минимум 50 очков лояльности для устройства на работу!`;
        startText = "Вы устроились курьером в  Cluckin' Bell! Взять заказ вы можете у двери слева";
        finishText = "Вы уволились из Cluckin' Bell!";
        deliverText = "Доставьте ваш заказ";
        undeliveredCommentText = "Недоставленный заказ";
       
    }
    

}


class deliveryJob {
    constructor() {
        this.hrCoord = {x: -136.757, y: 6198.713, z: 32.383};
        this.getOrderCoord = {x: -121.773, y: 6204.851, z: 32.381};
        this.deliveryPoints = [
            {x: -198.063, y: 6234.902, z: 31.5 },
            {x: -298.398, y: 6191.967, z: 31.489 },
        ];
        this.deliveryPointsList = [];
    }

    createEntities() {
        const hrColshape = mp.colshapes.newSphere(this.hrCoord.x, this.hrCoord.y, this.hrCoord.z, 0.5);
        this.hrColshape = hrColshape;

        const hrMarker = mp.markers.new(1, new mp.Vector3(this.hrCoord.x, this.hrCoord.y, this.hrCoord.z - 1), 0.75,
        {
            color: [250, 250, 50, 25],
            visible: true,
        });
        this.hrMarker = hrMarker;

        const hrBlip = mp.blips.new(514, new mp.Vector3(this.hrCoord.x, this.hrCoord.y, this.hrCoord.z),
		{	
            name: "Cluckin' Bell Factory",
			shortRange: true,
            scale: 1,
            color: 60,
        });
        this.hrBlip = hrBlip;
        
        ///////////////////////////////

        const getOrderColshape = mp.colshapes.newSphere(this.getOrderCoord.x, this.getOrderCoord.y, this.getOrderCoord.z, 0.5);
        this.getOrderColshape = getOrderColshape;

        const getOrderMarker = mp.markers.new(1, new mp.Vector3(this.getOrderCoord.x, this.getOrderCoord.y, this.getOrderCoord.z - 1), 0.75,
        {
            color: [255, 165, 0, 25],
            visible: false,
        });
        this.getOrderMarker = getOrderMarker;

        ///////////////////////////////

        for (let i = 0; i < this.deliveryPoints.length; i++) {
            const pos = this.deliveryPoints[i];

            const marker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75,
            {
                color: [255, 165, 0, 25],
                visible: false,
            });

            const colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1);

            const blip = mp.blips.new(1, new mp.Vector3(pos.x, pos.y, pos.z),
            {	
                name: "Delivery Point",
                shortRange: true,
                scale: 0,
                color: 60,
            });

            const obj = {
                blip: blip,
                marker: marker,
                colshape: colshape,
            }
            this.deliveryPointsList.push(obj);
        }

    }
    
    playerEntersHRShape(player) {
        player.info.canOpen.cBDeliveryMan = true;
        updateLanguage(player);
        if (player.info.activeJob.name && player.info.activeJob.name === "CB Delivery Men") {
            player.notify(showUninviteHRText);
            if (typeof player.info.activeJob.currentOrder === "number") {
                player.notify(`~r~${haveUndeliveredText}`);            
            }
        }
        else {
            player.notify(showInviteHRText);
        }
    }

    playerExitsHRShape(player) {
        player.info.canOpen.cBDeliveryMan = false;
    }

    playerPressedKeyOnHRShape(player) {
        updateLanguage(player);
        if (player.info.activeJob.name && player.info.activeJob.name === "CB Delivery Men") {
            this.uninvite(player);
        }
        else if (player.info.activeJob.name) {
            player.notify(alreadyHasJobText);
        }
        else {
            this.invite(player);
        }
    }

    uninvite(player) {
        if (typeof player.info.activeJob.currentOrder === "number") {
            updateLanguage(player);
            moneyAPI.addPenaltyOffline(player.name, 500, `Cluckin' Bell - ${undeliveredCommentText}`);
            loyality.removeLoyality(player, 10);
        }
        player.info.activeJob = {
            name: false,
        };
        player.notify(finishText);
        this.getOrderMarker.hideFor(player);
        player.setClothes(5, 0, 0);
    }

    invite(player) {
        if (player.info.loyality < 50) {
            player.notify(`~r~${needMoreLoyalityText}`);
            return;
        }
        player.info.activeJob = {
            name: "CB Delivery Men",
            currentOrder: false,
            canGetNewOrder: true,
        };
        player.notify(startText);
        this.getOrderMarker.showFor(player);
        player.setClothes(5, 45, 0);
    }

    generateNewOrder(player) {
        const i = misc.getRandomInt(0, this.deliveryPointsList.length - 1)
        if (i === player.info.activeJob.currentOrder) {
            return generateNewOrder(player);
        }
        this.cancelCurrentOrder(player);
        this.deliveryPointsList[i].marker.showFor(player);
        this.deliveryPointsList[i].blip.scale = 0.7;
        this.deliveryPointsList[i].blip.routeFor(player, 60, 0.7);
        player.info.activeJob.currentOrder = i
        return i;
    }

    cancelCurrentOrder(player) {
        if (typeof player.info.activeJob.currentOrder !== "number") return;
        const i = player.info.activeJob.currentOrder;
        this.deliveryPointsList[i].marker.hideFor(player);
        this.deliveryPointsList[i].blip.unrouteFor(player);
        this.deliveryPointsList[i].blip.scale = 0;
        player.info.activeJob.currentOrder = false;
    }

    playerEntersGetOrderShape(player) {
        if (!player.info.activeJob.name && player.info.activeJob.name !== "CB Delivery Men") return;
        updateLanguage(player);
        if (typeof player.info.activeJob.currentOrder === "number") {
            return player.notify(cantGetNewOrderText);
        }
        player.info.activeJob.canGetNewOrder = true;
        player.notify(canGetNewOrderText);
    }

    playerExitsGetOrderShape(player) {
        player.info.activeJob.canGetNewOrder = false;
    }

    playerPressedKeyOnNewOrderShape(player) {
        player.notify(deliverText);
        this.generateNewOrder(player);
    }

    successDeliver(player) {
        const prize = misc.getRandomInt(0, 100);
        const earnedMoney = 10 + prize;
        moneyAPI.changeMoney(player, earnedMoney);

        updateLanguage(player);
        player.notify(`${earnedText1} ~g~${earnedMoney}$! ~w~${earnedText2}`);
        if (player.info.loyality < 150) {
            loyality.addLoyality(player, 1);
        }
        this.cancelCurrentOrder(player);
    }
}

const job = new deliveryJob();
job.createEntities();



mp.events.add(
{
    "playerEnterColshape" : (player, shape) => {
        if (player.vehicle || !misc.isPlayerLoggedIn(player)) return;
        if (shape === job.hrColshape) {
            job.playerEntersHRShape(player);
        }
        else if (shape === job.getOrderColshape) {
            job.playerEntersGetOrderShape(player);
        }
        else if (!player.vehicle && typeof player.info.activeJob.currentOrder === "number" && shape === job.deliveryPointsList[player.info.activeJob.currentOrder].colshape) {
           job.successDeliver(player);
        }
        
    },


    "playerExitColshape" : (player, shape) => {
        if (!misc.isPlayerLoggedIn(player)) return;
        if (shape === job.hrColshape) {
            job.playerExitsHRShape(player);
        }
        else if (shape === job.getOrderColshape) {
            job.playerExitsGetOrderShape(player);
        }
    },


    "sKeys-E" : (player) => {
        if (!misc.isPlayerLoggedIn(player)) return;
        if (player.info.canOpen.cBDeliveryMan) {
            job.playerPressedKeyOnHRShape(player);
        }
        else if (player.info.activeJob.canGetNewOrder) {
            job.playerPressedKeyOnNewOrderShape(player);
        }

    },

    "playerQuit" : (player, exitType, reason) => {
        if (!misc.isPlayerLoggedIn(player)) return;
        if (player.info.activeJob.name && player.info.activeJob.name === "CB Delivery Men") {
            job.uninvite(player);
        }
    },


});
    