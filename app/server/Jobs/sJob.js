const misc = require('../sMisc');
const clothes = require('../Character/sClothes');
const i18n = require('../sI18n');



const jobsList = [];

function getJobByName(name) {
    for (const job of jobsList) {
        if (job.name === name) return job;
    }
}
module.exports.getJobByName = getJobByName;


mp.events.add({
    "playerEnterColshape" : (player, shape) => {
        if (!player.loggedIn || player.vehicle) return;
        if (!shape.job) return;
        player.canOpen.job = shape.job;
        const job = getJobByName(player.canOpen.job);
        job.enteredMainShape(player);
    },

    "playerExitColshape" : (player, shape) => {
        if (shape.job) player.canOpen.job = false;
    },
    
    "sKeys-E" : (player) => {
        if (!player.loggedIn || !player.canOpen.job) return;
        if (player.job.name !== i18n.get('sJob', 'unemployed', player.lang) && player.job.name !== player.canOpen.job) return player.notify(`~r~${i18n.get('basic', 'workingOnOtherJob', player.lang)}!`);
        const job = getJobByName(player.canOpen.job);
        job.pressedKeyOnMainShape(player);
    },

});




class Job {
    constructor(d) {
        this.name = d.name;
        this.mainMenu = { x: d.x, y: d.y, z: d.z, rot: d.rot, dim: d.dim };

        this.createMainEntities();
        this.setLocalSettings();
        jobsList.push(this);
    }

    createMainEntities() {
        this.marker = mp.markers.new(1, new mp.Vector3(this.mainMenu.x, this.mainMenu.y, this.mainMenu.z - 1), 0.75,
        {
            color: [0, 255, 0, 100],
            visible: true,
        });
        this.mainShape = mp.colshapes.newSphere(this.mainMenu.x, this.mainMenu.y, this.mainMenu.z, 1);
        this.mainShape.job = this.name;
    
        this.blip = mp.blips.new(514, new mp.Vector3(this.mainMenu.x, this.mainMenu.y, this.mainMenu.z),
        {	
            name: this.name,
            shortRange: true,
            scale: 0.7,
            color: 17,
        });
    }

    enteredMainShape(player) {
        player.notify(`${i18n.get('basic', 'pressEToOpenMenu', player.lang)}`);
    }

    startWork(player) {
        player.outputChatBox(`!{0, 200, 0}${i18n.get('sJob', 'start', player.lang)} ${this.name}`);
        if (player.model === 1885233650) this.setWorkingClothesForMan(player);
        else this.setWorkingClothesForWoman(player);
        misc.log.debug(`${player.name} started works as ${this.name}`);
    }

    setWorkingClothesForMan(player) {

    }

    setWorkingClothesForWoman(player) {
        
    }

    finishWork(player) {        
        player.outputChatBox(`!{200, 0, 0}${i18n.get('sJob', 'finish', player.lang)} ${this.name}`);
        misc.log.debug(`${player.name} finished works as ${this.name}`);
		player.job = {name: i18n.get('sJob', 'unemployed', player.lang) };
        clothes.loadPlayerClothes(player);
    }

    isPlayerWorksHere(player) {
        if (player.job.name && player.job.name === this.name) return true;
        return false;
    }

    isPlayerWorksOnOtherJob(player) {
        if (player.job.name !== i18n.get('sJob', 'unemployed', player.lang) && player.job.name !== player.canOpen.job) return true;
        return false;
    }

}
module.exports = Job;