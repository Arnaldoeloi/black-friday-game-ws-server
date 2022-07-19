

export class Player{
    
    name: string | undefined = '' ;
    isInGame: Boolean = false ;
    nickname: string | undefined = '' ;
    id: number | undefined;
    ws: any;

    constructor(id: number, name: string, nickname: string, isInGame:Boolean, ws: any) {
        this.id = id;
        this.name = name;
        this.nickname = nickname;
        this.isInGame = isInGame;
        this.ws = ws;
    }


}
