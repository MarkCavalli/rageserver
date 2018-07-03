const misc = require('../sMisc');
const moneyAPI = require('../Basic/sMoney');
const login = require('../Basic/sLogin');

function findPlayerByIdOrNickname(playerName) {
    if (playerName == parseInt(playerName))  {
        return mp.players.at(playerName);
    }
    else {
        let foundPlayer = null;

        mp.players.forEach((_player) => {
          if (_player.name === playerName) {
            foundPlayer = _player;
          }
        });

        return foundPlayer;
    }
}

mp.events.addCommand(
{
    'a' : async (player, message) => {
        mp.players.forEach(player => {
        if(player.info.adminLvl >= 1) {
            player.outputChatBox(`!{255, 179, 0}[A] ${player.name}: ${message}`)            
            return;
        }})
        	
    },

    'ooc' : async (player, message) => {
        if (player.info.adminLvl >= 1){
            mp.players.broadcast(`!{ff0000}Администратор!{ffffff} ${player.name}: ${message}`);
        }
    },	

    'me' : async (player, message) => {
        mp.players.broadcastInRange(player.position, 15, `!{#d644ff}${player.name} ${message}`);
    },

    'do' : async (player, message) => {
        mp.players.broadcastInRange(player.position, 15, `!{69,91,255}${message} |${player.name}`);
    },

    'b' : async (player, message) => {
        mp.players.broadcastInRange(player.position, 15, `!{ffffff}(( ${player.name} [${player.id}]: ${message} ))`);
    },

    'try' : async (player, message) => {
        rand = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        if (rand >= 5){
            mp.players.broadcastInRange(player.position, 15, `!{ffffff} ${player.name} [${player.id}]: ${message} | !{red}Неудачно`);
        } else {
            mp.players.broadcastInRange(player.position, 15, `!{ffffff} ${player.name} [${player.id}]: ${message} | !{green}Удачно`);
        };
    }, 

    // 'skey' : async(player, key) => {
    //     const squery = misc.query('UPDATE `users` SET `skey`="${key}" WHERE `username`="${player.name}"');
    //     player.outputChatBox(`Ваш новый ключ безопасности: ${key}`);
    // },

    "kick": async (player, args) =>
	{
        if(!args[0].length || !args[1].length) return player.outputChatBox("!{#999}/kick [id] [причина]");
        if(player.info.adminLvl >= 1) return player.outputChatBox("!{#ff2d00}Ошибка доступа!");
        const recipient = findPlayerByIdOrNickname(args[0]);

        if (!recipient) {
          player.outputChatBox("Игрок не найден");
          return false;
        }
        
        mp.players.forEach(_player => { 
            _player.outputChatBox("!{#ff2d00}" + recipient.name + " Кикнут " + player.name + ", причина: " + args[1]);
        });
        
        recipient.kick(args[1]);
	},
})