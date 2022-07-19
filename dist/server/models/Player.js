"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(id, name, nickname, isInGame, ws) {
        this.name = '';
        this.isInGame = false;
        this.nickname = '';
        this.id = id;
        this.name = name;
        this.nickname = nickname;
        this.isInGame = isInGame;
        this.ws = ws;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map