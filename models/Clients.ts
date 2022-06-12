class Clients{

    clientList: Map<String, any>;

    constructor() {
        this.clientList = new Map();
        this.saveClient = this.saveClient.bind(this);
    }

    saveClient(username: string | null, client: any){
        this.clientList.set(username?username:"Nameless", client);
    }
}

export { Clients };