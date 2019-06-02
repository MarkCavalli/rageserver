const misc = require('../sMisc');
const i18n = require('../sI18n');
const Job = require('./sJob');



class OrangeCollector extends Job {
    constructor() {
        const d = { name: "Orange Collector", x: 405.676, y: 6526.119, z: 27.709, rot: 0, dim: 0 }
        super(d);
        this.posToDrop = {x: 331.74, y: 6541.576, z: 28.417};
        this.checkPoints = [
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
        this.treeMarkersList = [];


        mp.events.add({
            "playerEnterColshape" : (player, shape) => {
                if (!player.loggedIn || player.vehicle || !this.isPlayerWorksHere(player)) return;
                if (shape.orangeCollectorTree === player.job.activeTree) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sOrangeCollector-EnteredTreeShape", 2400]);
                    }
                else if (shape === this.dropShape) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sOrangeCollector-EnteredDropShape", 2400]);
                }
            },

            "sOrangeCollector-EnteredTreeShape" : (player) => {
                this.enteredTreeShape(player);
            },

            "sOrangeCollector-EnteredDropShape" : (player) => {
                this.enteredDropShape(player);
            },
        
            "sOrangeCollector-StartWork" : (player) => {
                this.startWork(player);
            },
        
            "sOrangeCollector-FinishWork" : (player) => {
                this.finishWork(player);
            },
        
        });

        this.createMenuToDrop();
        this.createCheckpoints();
    }

    setLocalSettings() {
        this.blip.model = 514;
        this.blip.color = 17;
    }

    createMenuToDrop() {
        this.dropMarker = mp.markers.new(1, new mp.Vector3(this.posToDrop.x, this.posToDrop.y, this.posToDrop.z - 1), 0.75,
        {
            color: [255, 165, 0, 100],
            visible: false,
        });
        this.dropShape = mp.colshapes.newSphere(this.posToDrop.x, this.posToDrop.y, this.posToDrop.z, 1);
    }

    createCheckpoints() {
        for (let i = 0; i < this.checkPoints.length; i++) {
            const marker = mp.markers.new(1, new mp.Vector3(this.checkPoints[i].x, this.checkPoints[i].y, this.checkPoints[i].z - 1), 3,
            {
                color: [255, 165, 0, 50],
                visible: false,
            });
            marker.orangeCollectorTree = i;
            this.treeMarkersList.push(marker);
            const colshape = mp.colshapes.newSphere(this.checkPoints[i].x, this.checkPoints[i].y, this.checkPoints[i].z, 3);
            colshape.orangeCollectorTree = i;
        }
    }

    pressedKeyOnMainShape(player) {
        let execute = '';
        if (player.job.name === this.name) execute = `app.loadFinish();`;
        player.call("cOrangeCollector-OpenMainMenu", [player.lang, execute]);
    }

    startWork(player) {
        super.startWork(player);
        player.job = { name: this.name, collected: 0, activeTree: false };
        this.createRandomCheckPoint(player);
        this.dropMarker.showFor(player);
    }

    setWorkingClothesForMan(player) {
        player.setProp(0, 14, 0); // Hat
        player.setClothes(11, 78, misc.getRandomInt(0, 15), 0); // Top
        player.setClothes(3, 14, 0, 0);
        player.setClothes(252, 0, 0, 0);
        player.setClothes(4, 0, misc.getRandomInt(0, 15), 0); // Legs
    }

    setWorkingClothesForWoman(player) {
        player.setProp(0, 14, 0); // Hat
        player.setClothes(11, 78, misc.getRandomInt(0, 7), 0); // Top
        player.setClothes(3, 9, 0, 0);
        player.setClothes(82, 0, 0, 0);
        player.setClothes(4, 1, misc.getRandomInt(0, 15), 0); // Legs
    }

    createRandomCheckPoint(player) {
        const i = misc.getRandomInt(0, this.checkPoints.length - 1)
        if (i === player.job.activeTree) return this.createRandomCheckPoint(player);
        this.hideActiveCheckPoint(player);
        this.treeMarkersList[i].showFor(player);
        player.job.activeTree = i;
        return i;
    }

    hideActiveCheckPoint(player) {
        const i = player.job.activeTree;
        if (typeof i !== "number") return;
        this.treeMarkersList[i].hideFor(player);
        player.job.activeTree = false;
    }

    enteredTreeShape(player) {
        player.stopAnimation();
        player.job.collected += misc.getRandomInt(1, 2);
        player.notify(`${i18n.get('sOrangeCollector', 'collected1', player.lang)} ~g~${player.job.collected} ~w~${i18n.get('sOrangeCollector', 'collected2', player.lang)}!`);
        if (player.job.collected < 20) return this.createRandomCheckPoint(player);
        this.hideActiveCheckPoint(player);
        player.notify(`~g~${i18n.get('sOrangeCollector', 'full', player.lang)}!`);
    }

    enteredDropShape(player) {
        player.stopAnimation();
        if (player.job.collected === 0) return player.notify(`${i18n.get('sOrangeCollector', 'empty', player.lang)}!`);
        const earnedMoney = player.job.collected * 160;
        player.changeMoney(earnedMoney);
        player.notify(`${i18n.get('basic', 'earned1', player.lang)} ~g~$${earnedMoney}! ~w~${i18n.get('basic', 'earned2', player.lang)}!`);
        if (player.loyality < 50) player.addLoyality(player.job.collected / 10);
        misc.log.debug(`${player.name} earned $${earnedMoney} at orange collector job!`);
        player.job.collected = 0;
        if (!player.job.activeTree) this.createRandomCheckPoint(player);
    }

    finishWork(player) {
        this.hideActiveCheckPoint(player);
        this.dropMarker.hideFor(player);
        super.finishWork(player);
    }

    
}
new OrangeCollector();
