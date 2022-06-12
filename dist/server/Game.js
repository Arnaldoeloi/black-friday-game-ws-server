"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Player_1 = require("./Player");
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["WAITING_PLAYER"] = 0] = "WAITING_PLAYER";
    GAME_STATE[GAME_STATE["SETTING_UP_UNITS"] = 1] = "SETTING_UP_UNITS";
    GAME_STATE[GAME_STATE["WAITING_BOMB_DROP"] = 2] = "WAITING_BOMB_DROP";
})(GAME_STATE || (GAME_STATE = {}));
class Game {
    constructor() {
        this.state = GAME_STATE.WAITING_PLAYER;
        this.players = Array();
    }
    unitsLeftPerPlayer() {
        let units = [];
        this.players.forEach((p) => {
            units.push(p.unitsLeft());
        });
        return units;
    }
    startGame() {
        this.state = GAME_STATE.WAITING_PLAYER;
    }
    setPlayer(name) {
        //makes it so that only to players can play at a game
        if (this.players.length >= 2)
            return null;
        let player = new Player_1.Player(name);
        player.id = this.players.length;
        this.players.push(player);
        return player;
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map