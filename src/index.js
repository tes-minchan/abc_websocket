
const ws = require('ws');
const config = require('config').websocketConfig;
const { msgControl } = require('control');

const wss = new ws.Server({ port: config.port });

console.log(`Listening websocket server, port : ${config.port}`);

// Listening to Web connection.
wss.on('connection', function connection(ws) {
  console.log("new connection");

  ws.on('close', function close() {
    console.log('disconnected');
  });

  ws.on('message', function incoming(data) {
    const parseJson = JSON.parse(data);

    msgControl.setSubsType(ws, parseJson);
  });

});

// Broadcast to all.
wss.broadcast = function broadcast() {
  wss.clients.forEach(function each(client) {

    if (client.readyState === ws.OPEN) {
      if(client.subscribe) {
        msgControl.sendData(client);
      }
      else if(client.arbitrage) {
        msgControl.sendArbData(client);

      }
    } 
  });
};

setInterval(wss.broadcast, 1000);

