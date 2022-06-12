"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_STATE = exports.Game = void 0;
const Player_1 = require("./Player");
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["WAITING_PLAYER"] = 0] = "WAITING_PLAYER";
    GAME_STATE[GAME_STATE["SETTING_UP_UNITS"] = 1] = "SETTING_UP_UNITS";
    GAME_STATE[GAME_STATE["WAITING_BOMB_DROP"] = 2] = "WAITING_BOMB_DROP";
    GAME_STATE[GAME_STATE["GAME_ENDED"] = 3] = "GAME_ENDED";
})(GAME_STATE || (GAME_STATE = {}));
exports.GAME_STATE = GAME_STATE;
class Game {
    constructor() {
        this.state = GAME_STATE.WAITING_PLAYER;
        this.players = Array();
        this.serverCode = "";
    }
    setRandomTurnOwner() {
        this.turnOwner = this.players[Math.floor(Math.random() * this.players.length)];
    }
    checkWinner() {
        const loser = this.players.find((p) => p.unitsLeft() <= 0);
        if (!loser)
            return false;
        this.winner = this.players.find((p) => loser.id != p.id);
        this.state = GAME_STATE.GAME_ENDED;
        return this.winner;
    }
    startGame(serverCode) {
        this.state = GAME_STATE.WAITING_PLAYER;
        this.serverCode = serverCode;
    }
    allPlayersReady() {
        let isEveryoneReady = this.players.every((p) => p.isReady);
        return isEveryoneReady;
    }
    setPlayer(name, ws) {
        //makes it so that only 2 players can play at a game
        if (this.players.length >= 2)
            return null;
        let player = new Player_1.Player(name, ws);
        player.id = this.players.length;
        this.players.push(player);
        if (this.players.length == 2) {
            this.turnOwner = this.players[Math.floor(Math.random() * this.players.length)]; //picks who start randomly
            this.state = GAME_STATE.SETTING_UP_UNITS;
        }
        return player;
    }
    publicData() {
        var _a, _b;
        return {
            'serverCode': this.serverCode,
            'turnOwner': (_a = this.turnOwner) === null || _a === void 0 ? void 0 : _a.adversaryView(),
            'state': this.state,
            'winner': (_b = this.winner) === null || _b === void 0 ? void 0 : _b.adversaryView(),
            'players': this.players.map((player => { return player.adversaryView(); }))
        };
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map