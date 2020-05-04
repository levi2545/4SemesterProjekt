//import WebSocket from "ws";

var jsonObj;
const WebSocket = require('ws');
var track_clients = [];
var view_clients = [];


const wssView = new WebSocket.Server({ port: 8090 });
const wssTrack = new WebSocket.Server({ port: 8080 });


wssView.on('connection', function(ws) {
  view_clients.push(ws);
  console.log("Viewer Connected");
});

wssTrack.on('connection', function(ws) {
  track_clients.push(ws);
  console.log("Tracker Connected");
  ws.on('message', function incoming(message) {
    jsonObj = message.toString();
    jsonObj = JSON.parse(jsonObj);
    //jsonObj["connected_Trackers"] = track_clients.length;
    //console.log('Connected: ' + jsonObj.connected_Trackers);
    view_clients.forEach(function(client) {
      client.send(JSON.stringify(jsonObj));
    });
  });
});

