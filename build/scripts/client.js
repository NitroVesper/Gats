// []*-- Client --*[]
let port = 8080;
const socket = new WebSocket(`wss://CustomSocket.fghgfhgfhghfhgg.repl.co:${port}`);

const W = 87, A = 65, S = 83, D = 68;

function setup() {
  // Create the canvas
  createCanvas(600, 600);
  // Remove outline on players
  noStroke();
};

const data = {players:{}};
//the same thing as at the bottom but at the first moment
socket.on("open", update);

// get message about player change etc
socket.on("message", update);

function update(e) {
  data.players = e.data.players;
  console.log(data.players);
}

function draw() {

  background(50);

  // Check if the movement keys are pressed, if so then send an event
  if(keyIsDown(W)) socket.send(`move ${W}`);
  if(keyIsDown(A)) socket.send(`move ${A}`);
  if(keyIsDown(S)) socket.send(`move ${S}`);
  if(keyIsDown(D)) socket.send(`move ${D}`);

    // Draw each player
  for(let player of Object.values(data.players)) {

    // Draw the player
    fill(player.color.r, player.color.g, player.color.b);
    rect(player.pos.x, player.pos.y, player.size, player.size);
  }
}
