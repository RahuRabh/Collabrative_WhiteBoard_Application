const cors = require('cors');
const express = require('express');
const app = express(); app.use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res, next) => {
    res.send("Socket.Io Server for Whiteboarding App");
    res.set('Access-Control-Allow-Origin', '*');
   });

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

io.on('connection', onConnection);

io.on("connection", (socket) => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

http.listen(port, () => console.log('listening on port ' + port));