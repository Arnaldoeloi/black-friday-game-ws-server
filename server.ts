import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';


import { Game, GAME_STATE } from './models/Game';
import { Player } from './models/Player';
// import { Clients } from './models/Clients';


const games = Array<Game>();
const lobbyPlayers = Array<Player>();
const app = express();
// const clients = new Clients();


class Event{
    eventName: string;
    payload: any;

    constructor(eventName: string, payload: any){
        this.eventName = eventName;
        this.payload = payload;
    }

    public toString = () : string => {
        return `{ "eventName":"${this.eventName}", "payload":${JSON.stringify(this.payload)} }`;
    }
}

//initialize a simple http server
const server = http.createServer(app);


//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });


function broadcastEventToAllGamePlayers(event: Event, game:Game){
    console.log('broadcastingEvent', event.toString());
    game.players.forEach((p)=>{
        p.ws.send(event.toString());
    })
}

function sendEventToLobby(event: Event){
    console.log('broadcastingEvent', event.toString());
    lobbyPlayers.forEach((p)=>{
        p.ws.send(event.toString());
    })
}

function insertPlayerIntoLobby(player: Player){
    // if(!lobbyPlayers.find(p=>p.id == player.id))
    lobbyPlayers.push(player);
}

function playerFromRequest(userId:number, name:string, nickname:string, ws:any){
    const player = new Player(userId, name, nickname, false, ws );
    return player;
}

function listGamesAvailable(){
    return games;
    return games.filter(g=>g.state == GAME_STATE.WAITING_PLAYERS);
}

wss.on('connection',
    (ws:
        { on: (arg0: string, arg1: (data: any) => void) => void;
          emit: (arg0: any, arg1: any) => void;
          send: (arg0: string) => void; },
     request: any, client: { send: (arg0: any) => void; }) => {

    const params = new URLSearchParams(request.url);
    const userId = (params.get('/userId') ? parseInt(params.get('/userId')!) : 0);
    const name = params.get('name') ? params.get('name') : '';
    const nickname = params.get('nickname') ? params.get('nickname') : '';

    const serverName = params.get('serverName') ? params.get('serverName') : '';
    const reqPlayer = playerFromRequest(userId, name!, nickname!, ws);
    insertPlayerIntoLobby(reqPlayer);


    console.log('Communicating with client', ws);

    ws.on('playerMessage', function(data){
        const msgEvent = new Event('playerMessage', {'playerId':data.playerId, 'nickname':data.nickname, 'message':data.message})
        console.log(`${data.nickname} sent "${data.message}"`);
        sendEventToLobby(msgEvent);
        ws.send(msgEvent.toString());
    });

    ws.on('createNewServer', function(data){
        const game = new Game(data.serverName, reqPlayer, data.gameItems, data.serverTimeLimit, data.maxPlayers);
        games.push(game);
        const newServerEvent = new Event('serverCreated', {'playerId':data.playerId, 'nickname':data.nickname, 'serverName':data.serverName, 'serverTimeLimit': data.serverTimeLimit, "maxPlayers":data.maxPlayers, "serverIp":data.serverIp, "serverPort":data.serverPort});
        sendEventToLobby(newServerEvent);
    });

    ws.on('playerMovement', function(data){

    });

    ws.on('listServers', function(data){
        const availableGamesList = new Event('availableGames', {"games":listGamesAvailable()});
        ws.send(availableGamesList.toString());
    });


    // ws.on('dropBomb', function(data){
    //     const game =serverName? getGameByCode(serverName):null;
    //     if(game){
    //         if(game.state == GAME_STATE.GAME_ENDED){
    //             const event = new Event('error', {'message':'The game already ended!'})
    //             ws.send(event.toString());
    //             return false;
    //         }
    //         if(game.state != GAME_STATE.WAITING_BOMB_DROP){
    //             const event = new Event('error', {'message':'The game is not on this state.'})
    //             ws.send(event.toString());
    //             return false;
    //         }
    //         if(game.turnOwner?.name != clientName){
    //             const event = new Event('error', {'message':'It is not your turn!'})
    //             ws.send(event.toString());
    //             return false;
    //         }
    //         if(clientName){
    //             const player = game.players.find((p)=>p.name==clientName)
    //             const adversary = game.players.find((p)=>p.name!=clientName)
    //             if(player && adversary){
    //                 const bombStatus = adversary.receiveBombAt(data.posX,data.posY);
    //                 if(!bombStatus.isWater){
    //                     game.turnOwner = player;
    //                 }else{
    //                     game.turnOwner = adversary;
    //                 }

    //                 const event = new Event('bombDropped', {...game.publicData(),'bomb':bombStatus,'droppedOnPlayer':adversary.name});
    //                 broadcastEventToAllGamePlayers(event,game);

    //                 const winner = game.checkWinner()
    //                 if(winner){
    //                     const endEvent = new Event('gameEnded', game.publicData())
    //                     broadcastEventToAllGamePlayers(endEvent,game);
    //                 }
    //             }
    //         }
    //         return;
    //     }
    // });

    ws.on('createServer', function(data) {

        // if(!getGameByCode(data.serverName)){

        //     let game = new Game();
        //     console.log(clientName+' is attempting server creation.', data.serverName);
        //     game.startGame(data.serverName);

        //     games.push(game);

        //     if(clientName){
        //         game.setPlayer(clientName, ws);
        //         const event = new Event('serverCreated',game.publicData())
        //         ws.send(event.toString());
        //         // clients.clientList.get(clientName.toString())?.send(game.serverName?.toString());
        //     }
        //     console.log("games",games);

        //     return;
        // }


        const event = new Event('error', {"message":"There's another game with this code, try joining it."})
        ws.send(event.toString());
    });

    // ws.on('playerConnection', function(data){
    //     const game = getGameByCode(data.serverName)
    //     if(game){

    //         console.log(clientName+' is attempting to connect to server ', data.serverName);

    //         if(clientName){
    //             if(game.players.find((p)=>p.name==clientName)){
    //                 const event = new Event('error', {'message':'Already connected to server'});
    //                 return;
    //             }
    //             game.setPlayer(clientName, ws);
    //             const event = new Event('playerConnected', game.publicData())

    //             game.players.forEach((player=>{
    //                 console.log('broadcasting to player', player)
    //                 if(game.players.find((p)=> p.name == player.name)){
    //                     player.ws.send(event.toString());
    //                 }
    //             }));
    //             ws.send(event.toString());
    //         }
    //         console.log("games",games);

    //         return;
    //     }


    //     const event = new Event('error',{'serverName' : {"message":"The game doesn't exist. You could try creating it."}})
    //     ws.send(event.toString());
    // })


    ws.on('message', function message(data: any) {
        const parsed = JSON.parse(data);
        console.log('data', parsed);
        const { eventName, payload } = parsed;
        ws.emit(eventName, payload);
    });



});

//start our server
server.listen(process.env.PORT || 8081, () => {
    console.log(`Server started :)))))`);
});