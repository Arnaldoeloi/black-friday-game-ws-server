"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clients = void 0;
class Clients {
    constructor() {
        this.clientList = new Map();
        this.saveClient = this.saveClient.bind(this);
    }
    saveClient(username, client) {
        this.clientList.set(username ? username : "Nameless", client);
    }
}
exports.Clients = Clients;
//# sourceMappingURL=Clients.js.map