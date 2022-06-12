import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';


import { Game, GAME_STATE } from './models/Game';
import { Player } from './models/Player';
import { Clients } from './models/Clients';


const games = Array<Game>();
const app = express();
const clients = new Clients();


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

// declare global {
//     interface WebSocket {
//         emit(eventName: any, payload: any): any;
//     }
// }
// WebSocket.prototype.emit = function (eventName, payload): any {
//     console.log('Received event', eventName)
//     this.send(JSON.stringify({eventName, payload}));
// }

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

function getGameByCode(serverCode: string): Game|undefined{
    console.log(games?.find((game)=>game.serverCode==serverCode));
    return games?.find((game)=>game.serverCode==serverCode);
}

function notifyPrivateDataToAllPlayers(game: Game){
    game.players.forEach((p)=>notifyPrivateDataToPlayer(p));
}

function notifyPrivateDataToPlayer(player: Player){
    console.log('notifyingPrivateData', player)
    const event = new Event('privateDataUpdated', player.privateView())
    player.ws.send(event.toString());
}

function broadcastEventToAllPlayers(event: Event, game:Game){
    console.log('broadcastingEvent', event.toString());
    game.players.forEach((p)=>{
        p.ws.send(event.toString());
    })
}

wss.on('connection', 
    (ws: 
        { on: (arg0: string, arg1: (data: any) => void) => void; 
          emit: (arg0: any, arg1: any) => void;
          send: (arg0: string) => void; },
     request: any, client: { send: (arg0: any) => void; }) => {
    
    const params = new URLSearchParams(request.url);
    const clientName = params.get('/username') ? params.get('/username') : "Nameless";
    const serverCode = params.get('server') ? params.get('server') : '';
    
    clients.saveClient(clientName, ws);

    console.log('Communicating with client', ws);

    
    ws.on('dropBomb', function(data){
        console.log('unitsSetup', data);
        const game =serverCode? getGameByCode(serverCode):null;
        if(game){
            if(game.state == GAME_STATE.GAME_ENDED){
                const event = new Event('error', {'message':'The game already ended!'})
                ws.send(event.toString());
                return false;
            }
            if(game.state != GAME_STATE.WAITING_BOMB_DROP){
                const event = new Event('error', {'message':'The game is not on this state.'})
                ws.send(event.toString());
                return false;
            }
            if(game.turnOwner?.name != clientName){
                const event = new Event('error', {'message':'It is not your turn!'})
                ws.send(event.toString());
                return false; 
            }
            if(clientName){
                const player = game.players.find((p)=>p.name==clientName) 
                const adversary = game.players.find((p)=>p.name!=clientName) 
                if(player && adversary){
                    const bombStatus = adversary.receiveBombAt(data.posX,data.posY);
                    if(!bombStatus.isWater){
                        game.turnOwner = player;
                    }else{
                        game.turnOwner = adversary;
                    }



                    // player.setUpUnits(data);
                    // if(game.allPlayersReady()){
                    //     console.log('All players ready, changing game state')
                    //     game.state = GAME_STATE.WAITING_BOMB_DROP;
                    //     game.setRandomTurnOwner();
                    //     // notifyPrivateDataToAllPlayers(game);
                    // }


                    const event = new Event('bombDropped', {...game.publicData(),'bomb':bombStatus,'droppedOnPlayer':adversary.name});
                    broadcastEventToAllPlayers(event,game);
                    
                    notifyPrivateDataToAllPlayers(game);

                    const winner = game.checkWinner()
                    if(winner){
                        const endEvent = new Event('gameEnded', game.publicData())
                        broadcastEventToAllPlayers(endEvent,game);
                    }
                }
                // clients.clientList.get(clientName.toString())?.send(game.serverCode?.toString());
            }
            return;
        }
    });

    ws.on('createServer', function(data) {
          
        if(!getGameByCode(data.serverCode)){

            let game = new Game();
            console.log(clientName+' is attempting server creation.', data.serverCode);
            game.startGame(data.serverCode);

            games.push(game);
            
            if(clientName){
                game.setPlayer(clientName, ws);
                const event = new Event('serverCreated',game.publicData())
                ws.send(event.toString());
                // clients.clientList.get(clientName.toString())?.send(game.serverCode?.toString());
            }
            console.log("games",games);
            
            return;
        }


        const event = new Event('error', {"message":"There's another game with this code, try joining it."})
        ws.send(event.toString());

    });
    
    ws.on('playerConnection', function(data){
        const game = getGameByCode(data.serverCode)
        if(game){

            console.log(clientName+' is attempting to connect to server ', data.serverCode);

            if(clientName){
                if(game.players.find((p)=>p.name==clientName)){
                    const event = new Event('error', {'message':'Already connected to server'});
                    return;
                }
                game.setPlayer(clientName, ws);
                const event = new Event('playerConnected', game.publicData())
                
                game.players.forEach((player=>{
                    console.log('broadcasting to player', player)
                    if(game.players.find((p)=> p.name == player.name)){
                        player.ws.send(event.toString());
                    }
                }));
                ws.send(event.toString());
                // clients.clientList.get(clientName.toString())?.send(game.serverCode?.toString());
            }
            console.log("games",games);
            
            return;
        }


        const event = new Event('error',{'serverCode' : {"message":"The game doesn't exist. You could try creating it."}})
        ws.send(event.toString());
    })

    //makes the event handler much easier
    ws.on('message', function message(data: any) {
        const parsed = JSON.parse(data);
        // console.log('parsed',parsed);
        const { eventName, payload } = parsed;
        ws.emit(eventName, payload);
        
    });

    ws.on('unitsSetup', function(data){
        console.log('unitsSetup', data);
        const game =serverCode? getGameByCode(serverCode):null;
        if(game){
            if(clientName){
                const player = game.players.find((p)=>p.name==clientName) 
                console.log('clientName',clientName);
                if(player){
                    player.setUpUnits(data);
                    console.log('game.allPlayersReady()',game.allPlayersReady());
                    if(game.allPlayersReady()){
                        console.log('All players ready, changing game state')
                        game.state = GAME_STATE.WAITING_BOMB_DROP;
                        game.setRandomTurnOwner();
                        // notifyPrivateDataToAllPlayers(game);
                    }


                    const event = new Event('playerReady', game.publicData())
                    broadcastEventToAllPlayers(event,game);
                    notifyPrivateDataToPlayer(player);
                }
                // clients.clientList.get(clientName.toString())?.send(game.serverCode?.toString());
            }
            return;
        }
    });

    

    


    //connection is up, let's add a simple simple event
    // ws.on('message', (message) => {

    //     //log the received message and send it back to the client
    //     console.log('received: %s', message);

    //     const broadcastRegex = /^broadcast\:/;

    //     if (broadcastRegex.test(message)) {
    //         message = message.replace(broadcastRegex, '');

    //         //send back the message to the other clients
    //         wss.clients
    //             .forEach(client => {
    //                 if (client != ws) {
    //                     client.send(`Hello, broadcast message -> ${message}`);
    //                 }    
    //             });
            
    //     } else {
    //         ws.send(`Hello, you sent -> ${message}`);
    //     }
    // });
    
    
    // ws.send(`Hello, you sent -> ${req.url}`);
    //send immediatly a feedback to the incoming connection    
    // ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8081, () => {
    console.log(`Server started :)))))`);
});