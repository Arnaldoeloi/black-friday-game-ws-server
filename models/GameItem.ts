

export class GameItem{
    
    name: string | undefined = '' ;
    id: number | undefined;
    score: number = 10;
    position: { 'x': number; 'y': number; 'z': number; } | undefined;
    isCollected: Boolean | undefined;

    constructor(name: string, score: any) {
        this.name = name;
        this.score = score;
    }

}
