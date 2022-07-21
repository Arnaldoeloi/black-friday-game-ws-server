"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_STATE = exports.Game = void 0;
const GamePlayer_1 = require("./GamePlayer");
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["WAITING_PLAYERS"] = 0] = "WAITING_PLAYERS";
    GAME_STATE[GAME_STATE["PLAYING"] = 1] = "PLAYING";
    GAME_STATE[GAME_STATE["GAME_ENDED"] = 2] = "GAME_ENDED";
})(GAME_STATE || (GAME_STATE = {}));
exports.GAME_STATE = GAME_STATE;
class Game {
    constructor(serverName, host, gameItems, serverTimeLimit, maxPlayers) {
        this.state = GAME_STATE.WAITING_PLAYERS;
        this.players = Array();
        this.serverName = "";
        this.serverIp = "localhost";
        this.serverPort = 7777;
        this.serverTimeLimit = 120;
        this.maxPlayers = 4;
        this.gameItems = [];
        this.state = GAME_STATE.WAITING_PLAYERS;
        this.gameItems = gameItems;
        this.serverName = serverName;
        this.serverTimeLimit = serverTimeLimit;
        this.maxPlayers = maxPlayers;
        this.host = host;
    }
    startGame() {
        this.state = GAME_STATE.PLAYING;
    }
    allPlayersReady() {
        let isEveryoneReady = this.players.every((p) => p.isReady);
        return isEveryoneReady;
    }
    setPlayer(name, ws) {
        //makes it so that only 2 players can play at a game
        // if(this.players.length>=2)return null;
        let player = new GamePlayer_1.GamePlayer(name, ws);
        player.id = this.players.length;
        this.players.push(player);
        return player;
    }
    updatePlayerPosition(playerId, position) {
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map