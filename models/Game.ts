import { GamePlayer } from './GamePlayer';
import { GameItem } from './GameItem';

import { Player } from './Player';

enum GAME_STATE{
    WAITING_PLAYERS,
    PLAYING,
    GAME_ENDED,
}
class Game {

    state = GAME_STATE.WAITING_PLAYERS;
    players = Array<GamePlayer>();
    hostNickname: string = "";
    serverName: string = "";
    serverIp: string = "127.0.0.1";
    serverPort: number = 7777;
    serverTimeLimit: number = 120;
    maxPlayers: number = 4;
    host: Player | undefined;

    gameItems: Array<GameItem> = [];


    constructor(serverName: string, host: Player, gameItems: Array<GameItem>, serverTimeLimit: number, maxPlayers: number, hostNickname: string, serverIp: string, serverPort: number){
        this.state = GAME_STATE.WAITING_PLAYERS;
        this.gameItems = gameItems;
        this.serverName = serverName;
        this.serverTimeLimit = serverTimeLimit;
        this.maxPlayers = maxPlayers;
        this.host = host;
        this.serverIp = serverIp;
        this.serverPort = serverPort;
        this.hostNickname = hostNickname;
    }

    startGame(){
        this.state = GAME_STATE.PLAYING;
    }

    allPlayersReady(){
        let isEveryoneReady = this.players.every((p)=>p.isReady);
        return isEveryoneReady;
    }

    setPlayer(name: string, ws:any){
        //makes it so that only 2 players can play at a game
        // if(this.players.length>=2)return null;

        let player = new GamePlayer(name, ws);
        player.id = this.players.length;

        this.players.push(player);

        return player;
    }

    updatePlayerPosition(playerId:number, position:{ 'x': number, 'y': number, 'z': number }){

    }
    
}

export {Game, GAME_STATE};
