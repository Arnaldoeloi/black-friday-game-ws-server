"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlayer = void 0;
class GamePlayer {
    constructor(nickname, player) {
        this.nickname = '';
        this.gameItems = [];
        this.nickname = nickname;
        this.player = player;
        this.ws = player.ws;
        this.isReady = false;
    }
}
exports.GamePlayer = GamePlayer;
//# sourceMappingURL=GamePlayer.js.map