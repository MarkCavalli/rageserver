const misc = require('../sMisc');
const i18n = require('../sI18n');
const Job = require('./sJob');


class ClickinBellCourier extends Job {
    constructor() {
        const d = { name: "Cluckin Bell Courier", x: -145.918, y: 6303.983, z: 31.559, rot: 131.94, dim: 0 }
        super(d);
        this.getOrderCoord = { x: -139.975, y: 6301.485, z: 31.488, rot: 134.19 };
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
            {x: -127.034, y: 6551.019, z: 29.503 },   
            {x: -106.835, y: 6530.79, z: 29.858 },   
            {x: -35.13, y: 6581.948, z: 31.459 },   
            {x: -29.519, y: 6599.831, z: 31.471 },   
            {x: -39.694, y: 6637.645, z: 31.088 },   
            {x: -2.638, y: 6614.571, z: 31.471 },   
            {x: -8.345, y: 6652.296, z: 31.114 },   
            {x: 40.488, y: 6660.142, z: 31.7 },   
            {x: 120.522, y: 6643.05, z: 31.834 },
            {x: 26.697, y: 6605.031, z: 32.47 },
            {x: 15.695, y: 6575.519, z: 32.716 },
            {x: -25.021, y: 6554.832, z: 31.92 },
            {x: 2.473, y: 6499.43, z: 31.449 },
            {x: -59.498, y: 6392.666, z: 31.49 },
            {x: -91.387, y: 6355.255, z: 35.501 },
            {x: 52.409, y: 6487.162, z: 31.427 },
            {x: -450.65, y: 6268.777, z: 33.33 },
            {x: -400.974, y: 6321.669, z: 28.946 },
            {x: -358.623, y: 6333.534, z: 29.839 },
            {x: -319.229, y: 6301.614, z: 36.584 },
            {x: -290.511, y: 6320.165, z: 32.513 },
            {x: -269.89, y: 6353.946, z: 32.49 },
            {x: -269.945, y: 6400.332, z: 31.342 },
        ];
        this.deliveryPointsList = [];

        mp.events.add({
            "playerEnterColshape" : (player, shape) => {
                if (player.vehicle || !player.loggedIn || !this.isPlayerWorksHere(player)) return;
                if (shape === this.getOrderColshape) this.playerEntersGetOrderShape(player);
                else if (typeof player.job.currentOrder === "number" && shape === this.deliveryPointsList[player.job.currentOrder].colshape) {
                   player.job.orders -= 1;
                    
                    player.job.ammount = player.job.maxammount - player.job.orders;
                    player.job.xp += 1;
                    
                    this.successDeliver(player);
                    if (player.job.orders > 0)
                    {
                        player.notify(`~g~${i18n.get('sCBDeliveryMen', 'deliver', player.lang)}!`);
                        this.generateNewOrder(player);
                    }
                    else
                    {
						player.notify(`~g~${i18n.get('sCBDeliveryMen', 'deliver1', player.lang)}!`);
						player.notify(`~g~${i18n.get('sCBDeliveryMen', 'deliver2', player.lang)}!`);
						player.notify(`${i18n.get('sCBDeliveryMen', 'deliver3', player.lang)} ~g~${player.job.money}$`);
                    }
                }
            },
        
            "playerExitColshape" : (player, shape) => {
                if (!player.loggedIn) return;
                if (shape === this.getOrderColshape) this.playerExitsGetOrderShape(player);
            },
        
            "sKeys-E" : (player) => {
                if (!player.loggedIn || !player.job.canGetNewOrder) return;
                this.playerPressedKeyOnNewOrderShape(player);
            },
        
            "playerQuit" : (player, exitType, reason) => {
                if (!player.loggedIn) return;
                if (this.isPlayerWorksHere(player)) this.finishWork(player);
            },
			
			"sCluckinBellCourier-StartWork": (player) => {
                this.startWork(player);
            },
            "sCluckinBellCourier-FinishWork": (player) => {
                this.finishWork(player);
            },
            "sCluckinBellCourier-NewOrderFromClient": (player) => {
                this.generateNewOrder(player)
            },
        
        });

        this.createEntities();
    }

    setLocalSettings() {
        this.blip.model = 514;
        this.blip.color = 60;
    }

    createEntities() {
        this.getOrderColshape = mp.colshapes.newSphere(this.getOrderCoord.x, this.getOrderCoord.y, this.getOrderCoord.z, 0.5);

        this.getOrderMarker = mp.markers.new(1, new mp.Vector3(this.getOrderCoord.x, this.getOrderCoord.y, this.getOrderCoord.z - 1), 0.75,
        {
            color: [255, 165, 0, 255],
            visible: false,
        });

        for (const pos of this.deliveryPoints) {
            const marker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75, {
                color: [0, 255, 255, 100],
                visible: false,
            });
            const colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1);
            const obj = { marker, colshape }
            this.deliveryPointsList.push(obj);
        }

    }

    enteredMainShape(player) {
        if (this.isPlayerWorksHere(player)) {
            player.notify(`${i18n.get('sCBDeliveryMen', 'uninvite', player.lang)}!`);
            if (typeof player.job.currentOrder === "number") player.outputChatBox(`!{225, 0, 0}${i18n.get('sCBDeliveryMen', 'haveUndeliveredOrder', player.lang)}!`);
        }
        else player.notify(`${i18n.get('sCBDeliveryMen', 'invite', player.lang)}!`);
    }

    pressedKeyOnMainShape(player) {
        let execute = '';
        if (player.job.name === this.name) execute = `app.loadFinish();`;
        player.call("cCluckinBellCourier-OpenMainMenu", [player.lang, execute]);
    }

    finishWork(player) {
        if (typeof player.job.currentOrder === "number") {
            var rest = player.job.maxammount - player.job.ammount;
            var taxpay = 30 * rest;
            player.newFine(taxpay, `Cluckin Bell - ${i18n.get('sCBDeliveryMen', 'undelivered', player.lang)}`);
            player.removeLoyality(10);
        }
        this.cancelCurrentOrder(player);
        super.finishWork(player);
    }

    startWork(player) {
        super.startWork(player);
		
        player.job.name = this.name;
        player.job.currentOrder = false;
        player.job.canGetNewOrder = false;
        player.job.orders = 0;
        player.job.deliveryPoints = [];
		
		player.job.ammount = 0;
        player.job.maxammount = 0;
        player.job.active = 1;
        player.job.money = 0;
		
        this.getOrderMarker.showFor(player);
    }

    playerEntersGetOrderShape(player) {
        if (!this.isPlayerWorksHere(player)) return;
        if (typeof player.job.currentOrder === "number") return player.notify(`~r~${i18n.get('sCBDeliveryMen', 'cantGetNewOrder', player.lang)}!`);
        player.job.canGetNewOrder = true;
        player.notify(`${i18n.get('sCBDeliveryMen', 'getNewOrder', player.lang)}!`);
    }

    playerPressedKeyOnNewOrderShape(player) {
        if (player.job.orders == 0) {
            player.job.orders = 10;
            player.job.ammount = 0;
            player.job.money = 0;
            player.job.maxammount = player.job.orders;
            player.notify(`~g~${i18n.get('sCBDeliveryMen', 'deliver', player.lang)}!`);
			
            player.call('createCluckinBellBlip', [this.deliveryPoints, i18n.get('sCBDeliveryMen', 'deliverblip', player.lang)]);
        }
        else
        {
			player.notify(`~g~${i18n.get('sCBDeliveryMen', 'deliver4', player.lang)} ${player.job.orders} ${i18n.get('sCBDeliveryMen', 'deliver5', player.lang)}`);
        }
    }

    generateNewOrder(player) {
        const i = misc.getRandomInt(0, this.deliveryPointsList.length - 1)
        if (i === player.job.currentOrder) return this.generateNewOrder(player);
        this.cancelCurrentOrder(player);
        this.deliveryPointsList[i].marker.showFor(player);
        player.call('routeCluckinBellBlip', [this.deliveryPoints[i], i18n.get('sCBDeliveryMen', 'deliverblip', player.lang)]);
        player.job.currentOrder = i        
        return i;
    }

    cancelCurrentOrder(player) {
        if (typeof player.job.currentOrder !== "number") return;
        const i = player.job.currentOrder;
        this.deliveryPointsList[i].marker.hideFor(player);     
        player.call('unrouteCluckinBellBlip', [i]);
        player.job.currentOrder = false;
    }

    playerExitsGetOrderShape(player) {
        player.job.canGetNewOrder = false;
    }

    successDeliver(player) {
        const prize = misc.getRandomInt(3, 10);
        const earnedMoney = 5 + prize;
		
        player.job.money += earnedMoney;
        player.changeMoney(earnedMoney);
		
        player.notify(`${i18n.get('basic', 'earned1', player.lang)} ~g~$${earnedMoney}! ~w~${i18n.get('basic', 'earned2', player.lang)}!`);
        if (player.loyality < 150) player.addLoyality(1);
        this.cancelCurrentOrder(player);
    }
    
}
new ClickinBellCourier();