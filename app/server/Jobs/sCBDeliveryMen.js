"use strict"

const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const loyality = require('../Basic/sLoyality');
const i18n = require('../sI18n');


class deliveryJob {
    constructor() {
        this.hrCoord = {x: -136.757, y: 6198.713, z: 32.383};
        this.getOrderCoord = {x: -121.773, y: 6204.851, z: 32.381};
        this.deliveryPoints = [
            {x: -198.063, y: 6234.902, z: 31.5 },
            {x: -298.398, y: 6191.967, z: 31.489 },
            {x: -342.872, y: 6098.942, z: 31.332 },
            {x: -381.071, y: 6061.897, z: 31.5},
            {x: -395.839, y: 6077.874, z: 31.5 },
            {x: -366.815, y: 6101.681, z: 35.44 },
            {x: -414.46, y: 6173.699, z: 31.478 },
            {x: -373.985, y: 6187.07, z: 31.536 },
            {x: -365.139, y: 6206.338, z: 31.573 },
            {x: -346.794, y: 6224.036, z: 31.511 },
            {x: -309.96, y: 6273.621, z: 31.492 },
            {x: -260.763, y: 6291.354, z: 31.484 },
            {x: -213.063, y: 6358.329, z: 31.492 },
            {x: -216.438, y: 6375.306, z: 31.518 },
            {x: -236.293, y: 6421.802, z: 31.204 },
            {x: -218.095, y: 6454.488, z: 31.199 },
            {x: -110.337, y: 6457.95, z: 31.466 },
            {x: -33.145, y: 6455.303, z: 31.476 },           
        ];
        this.deliveryPointsList = [];

        mp.events.add({
            "playerEnterColshape" : (player, shape) => {
                if (player.vehicle || !player.loggedIn) return;
                if (shape === this.hrColshape) this.playerEntersHRShape(player);
                else if (shape === this.getOrderColshape) this.playerEntersGetOrderShape(player);
                else if (typeof player.activeJob.currentOrder === "number" && shape === this.deliveryPointsList[player.activeJob.currentOrder].colshape) {
                   this.successDeliver(player);
                }
            },
        
            "playerExitColshape" : (player, shape) => {
                if (!player.loggedIn) return;
                if (shape === this.hrColshape) this.playerExitsHRShape(player);
                else if (shape === this.getOrderColshape) job.playerExitsGetOrderShape(player);
            },
        
            "sKeys-E" : (player) => {
                if (!player.loggedIn) return;
                if (player.canOpen.cBDeliveryMan) this.playerPressedKeyOnHRShape(player);
                else if (player.activeJob.canGetNewOrder) job.playerPressedKeyOnNewOrderShape(player);
            },
        
            "playerQuit" : (player, exitType, reason) => {
                if (!player.loggedIn) return;
                if (player.activeJob.name && player.activeJob.name === "CB Delivery Men") {
                    this.uninvite(player);
                }
            },
        
        });
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
            scale: 0.7,
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
        player.canOpen.cBDeliveryMan = true;
        if (player.activeJob.name && player.activeJob.name === "CB Delivery Men") {
            player.notify(`${i18n.get('sCBDeliveryMen', 'uninvite', player.lang)}!`);
            if (typeof player.activeJob.currentOrder === "number") {
                player.outputChatBox(`!{225, 0, 0}${i18n.get('sCBDeliveryMen', 'haveUndeliveredOrder', player.lang)}!`);
            }
        }
        else {
            player.notify(`${i18n.get('sCBDeliveryMen', 'invite', player.lang)}!`);
        }
    }

    playerExitsHRShape(player) {
        player.canOpen.cBDeliveryMan = false;
    }

    playerPressedKeyOnHRShape(player) {
        if (player.activeJob.name && player.activeJob.name === "CB Delivery Men") {
            this.uninvite(player);
        }
        else if (player.activeJob.name) {
            player.notify(`~r~${i18n.get('basic', 'workingOnOtherJob', player.lang)}!`);
        }
        else {
            this.invite(player);
        }
    }

    uninvite(player) {
        if (typeof player.activeJob.currentOrder === "number") {
            moneyAPI.newFine(player.basic.id, 500, `Cluckin Bell - ${i18n.get('sCBDeliveryMen', 'undelivered', player.lang)}`);
            loyality.remove(player, 10);
        }
        this.cancelCurrentOrder(player)
        player.activeJob = {
            name: false,
        };
        player.notify(`${i18n.get('sCBDeliveryMen', 'finished', player.lang)}!`);
        misc.log.debug(`${player.name} finished Cluckin Bell delivery job`);
    }

    invite(player) {
        if (loyality.get(player) < 50) {
            return player.notify(`~r~${i18n.get('basic', 'needMoreLoyality1', player.lang)} 50 ${i18n.get('basic', 'needMoreLoyality2', player.lang)}!`);
        }
        player.activeJob = {
            name: "CB Delivery Men",
            currentOrder: false,
            canGetNewOrder: true,
        };
        player.outputChatBox(`!{0, 200, 0}${i18n.get('sCBDeliveryMen', 'started', player.lang)}!`);
        this.getOrderMarker.showFor(player);
        misc.log.debug(`${player.name} started Cluckin Bell delivery job`);
    }

    generateNewOrder(player) {
        const i = misc.getRandomInt(0, this.deliveryPointsList.length - 1)
        if (i === player.activeJob.currentOrder) {
            return this.generateNewOrder(player);
        }
        this.cancelCurrentOrder(player);
        this.deliveryPointsList[i].marker.showFor(player);
        this.deliveryPointsList[i].blip.scale = 0.7;
        this.deliveryPointsList[i].blip.routeFor(player, 60, 0.7);
        player.activeJob.currentOrder = i
        return i;
    }

    cancelCurrentOrder(player) {
        if (typeof player.activeJob.currentOrder !== "number") return;
        const i = player.activeJob.currentOrder;
        this.deliveryPointsList[i].marker.hideFor(player);
        this.deliveryPointsList[i].blip.unrouteFor(player);
        this.deliveryPointsList[i].blip.scale = 0;
        player.activeJob.currentOrder = false;
    }

    playerEntersGetOrderShape(player) {
        if (!player.activeJob.name && player.activeJob.name !== "CB Delivery Men") return;
        if (typeof player.activeJob.currentOrder === "number") {
            return player.notify(`~r~${i18n.get('sCBDeliveryMen', 'cantGetNewOrder', player.lang)}!`);
        }
        player.activeJob.canGetNewOrder = true;
        player.notify(`${i18n.get('sCBDeliveryMen', 'getNewOrder', player.lang)}!`);
    }

    playerExitsGetOrderShape(player) {
        player.activeJob.canGetNewOrder = false;
    }

    playerPressedKeyOnNewOrderShape(player) {
        player.notify(`~g~${i18n.get('sCBDeliveryMen', 'deliver', player.lang)}!`);
        this.generateNewOrder(player);
    }

    successDeliver(player) {
        const prize = misc.getRandomInt(0, 100);
        const earnedMoney = 30 + prize;
        moneyAPI.changeMoney(player, earnedMoney);

        player.notify(`${i18n.get('basic', 'earned1', player.lang)} ~g~$${earnedMoney}! ~w~${i18n.get('basic', 'earned2', player.lang)}!`);
        if (loyality.get(player) < 150) loyality.add(player, 1);
        this.cancelCurrentOrder(player);
        misc.log.debug(`${player.name} earned $${earnedMoney}`);
    }
}

const job = new deliveryJob();
job.createEntities();
    