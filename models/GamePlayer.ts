import { GameItem } from './GameItem';
import { Player } from './Player';

export class GamePlayer{
    
    nickname: string | undefined = '' ;
    id: number | undefined;
    position: { 'x': number; 'y': number; 'z': number; } | undefined;
    isReady: Boolean | undefined;
    gameItems: Array<GameItem> = [];
    player: Player | undefined;

    ws: any;
    
    constructor(nickname: string, player: Player) {
        this.nickname = nickname;
        this.player = player;
        this.ws = player.ws;
        this.isReady = false;
    }

    
}
