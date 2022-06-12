

export class Player{
    
    name: string | undefined = '' ;
    id: number | undefined; //if is player 1 or 2
    units: Array<{'posX':number; 'posY':number; 'isBombed':Boolean; 'type':string}> = [];
    receivedBombs: Array<{'posX':number; 'posY':number; 'isWater':Boolean}> = [];
    ws: any;
    isReady: Boolean | undefined;

    unitsLeft(){
        return this.units.filter(u=>!u.isBombed).length;
    }

    constructor(name: string, ws: any) {
        this.name = name;
        this.ws = ws;
        this.isReady = false;
    }

    receiveBombAt(posX: number, posY: number){
        let unit = this.units.filter((u)=>u.posX==posX && u.posY==posY)[0];
        if(unit){
            unit.isBombed = true;
        }

        let bombStatus = {posX,posY,isWater:(!unit)};
        this.receivedBombs.push(bombStatus);

        return bombStatus;
    }

    setUpUnits(units:Array<{'posX':number; 'posY':number; 'isBombed':Boolean; 'type':string}>){
        //NEED TO SETUP RULE CHECK FOR THAT, THIS IS UNSAFE BUT IT'LL WORK FOR NOW
        this.units = units;
        this.isReady = true;
        return units;
    }

    privateView(){
        return {
            'name': this.name,
            'id': this.id,
            'receivedBombs': this.receivedBombs,
            'units': this.units,
            'isReady': this.isReady
        }
    }

    adversaryView(){
        return {
            'name':this.name,
            'id':this.id,
            'isReady':this.isReady,
            'receivedBombs':this.receivedBombs
        }
    }

}
