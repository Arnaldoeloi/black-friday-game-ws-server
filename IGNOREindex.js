// Importing the required modules
const Game = require('./models/Game');

const WebSocketServer = require('ws');
 
// Creating a new websocket server
const wss = new Server({ port: 8080 })
 
// let game = new Game();
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
    // sending message
    ws.on("message", event => {
        handleClientMessage(event);
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});

function handleClientMessage(event){
    console.log(`Client has sent us: ${event}`)
}

console.log("The WebSocket server is running on port 8080");