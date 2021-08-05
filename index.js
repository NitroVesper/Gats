// Load http 
const express = require('express');
const app = express();
const server = app.listen(8080);

app.use(express.static('./build'));

//  []*-- Server --*[] websocket

const W = 87; const A = 65; const S = 83; const D = 68;
const WebSocket = require('ws');
const wss = new WebSocket.Server({server});

let data = {players:{}};
let availableId = 0;

let width = 600;
let height = 600;
                  
wss.on("connection", socket => {
  // New player connected
  console.log("player connected");
  let id = availableId++;

  // Create new player
    data.players[id] = {
    pos:{x:Math.random()*100, y:Math.random()*100},
    speed:2,
    size:16,
    color:{r:Math.random()*255, g:Math.random()*255, b:Math.random()*255}
    };

    socket.on("close", () => {
    // Player  disconnected
    console.log("player disconnected");
    // Delete player
    delete data.players[id];
    });

    socket.send(data.players); // sending data

    socket.on("message", (e) => {
    //parsing arguments
    let msg = e.data.split(" ");
    let action = msg.shift();

    //if moving, emitting move event and sending a key converted to integer
    if(action === "move") socket.emit("move", +msg[0]);
    })

  // Movement event
    socket.on("move", key => {
    // Get the current player
    let player = data.players[id];

    // Check which movement key was pressed, and move accordingly
    if(key == W) player.pos.y -= player.speed;
    if(key == A) player.pos.x -= player.speed;
    if(key == S) player.pos.y += player.speed;
    if(key == D) player.pos.x += player.speed;

    // Check if player is touching the boundry, if so stop them from moving past it
    if(player.pos.x > width - player.size) player.pos.x = width - player.size;
    if(player.pos.x < 0) player.pos.x = 0;
    if(player.pos.y > height - player.size) player.pos.y = height - player.size;
    if(player.pos.y < 0) player.pos.y = 0;

    wss.clients.forEach(socket => socket.send({action: "data", data: data.players}));
  });
});
