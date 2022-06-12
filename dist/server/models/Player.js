"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(name, ws) {
        this.name = '';
        this.units = [];
        this.receivedBombs = [];
        this.name = name;
        this.ws = ws;
        this.isReady = false;
    }
    unitsLeft() {
        return this.units.filter(u => !u.isBombed).length;
    }
    receiveBombAt(posX, posY) {
        let unit = this.units.filter((u) => u.posX == posX && u.posY == posY)[0];
        if (unit) {
            unit.isBombed = true;
        }
        let bombStatus = { posX, posY, isWater: (!unit) };
        this.receivedBombs.push(bombStatus);
        return bombStatus;
    }
    setUpUnits(units) {
        //NEED TO SETUP RULE CHECK FOR THAT, THIS IS UNSAFE BUT IT'LL WORK FOR NOW
        this.units = units;
        this.isReady = true;
        return units;
    }
    privateView() {
        return {
            'name': this.name,
            'id': this.id,
            'receivedBombs': this.receivedBombs,
            'units': this.units,
            'isReady': this.isReady
        };
    }
    adversaryView() {
        return {
            'name': this.name,
            'id': this.id,
            'isReady': this.isReady,
            'receivedBombs': this.receivedBombs
        };
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map