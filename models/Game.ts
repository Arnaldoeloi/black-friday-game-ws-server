import { Player } from './Player';

enum GAME_STATE{
    WAITING_PLAYER,
    SETTING_UP_UNITS,
    WAITING_BOMB_DROP,
    GAME_ENDED,
}
class Game {

    state = GAME_STATE.WAITING_PLAYER;
    players = Array<Player>();
    turnOwner: Player | undefined ;
    serverCode: string = "";
    winner: Player | undefined;


    setRandomTurnOwner(){
        this.turnOwner = this.players[Math.floor(Math.random() * this.players.length)];
    }

    checkWinner(){
        const loser = this.players.find((p)=>p.unitsLeft()<=0);
        if(!loser)return false;
        this.winner = this.players.find((p)=>loser.id!=p.id);
        this.state = GAME_STATE.GAME_ENDED;
        return this.winner;
    }

    startGame(serverCode: string){
        this.state = GAME_STATE.WAITING_PLAYER;
        this.serverCode = serverCode;
    }

    allPlayersReady(){
        let isEveryoneReady = this.players.every((p)=>p.isReady);
        return isEveryoneReady;
    }

    setPlayer(name: string, ws:any){
        //makes it so that only 2 players can play at a game
        if(this.players.length>=2)return null;

        let player = new Player(name, ws);
        player.id = this.players.length;

        this.players.push(player);

        
        if(this.players.length==2){
            this.turnOwner = this.players[Math.floor(Math.random() * this.players.length)]; //picks who start randomly
            this.state = GAME_STATE.SETTING_UP_UNITS;
        }

        return player;
    }

    publicData(){
        return {
            'serverCode':this.serverCode,
            'turnOwner': this.turnOwner?.adversaryView(),
            'state':this.state,
            'winner':this.winner?.adversaryView(),
            'players':this.players.map((player=>{return player.adversaryView()}))
        }
    }

    







    
}

export {Game, GAME_STATE};
