"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(name) {
        this.name = '';
        this.units = [];
        this.receivedBombs = [];
        this.name = name;
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
        return units;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map