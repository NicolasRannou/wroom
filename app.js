var express = require('express');
var app = express(), server = require('http').createServer(app), io = require(
    'socket.io').listen(server);
server.listen(9990);
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket) {
  socket.emit('message', {data: "Please enter a username..."});
  
  var username;
  socket.on('message', function(msg) {
    if (!username) {
      username = msg.data;
      socket.broadcast.emit('message', {data:'<b>'+msg.data+' has entered the zone...</b>'});
      return;
    }
    socket.emit('message', {data:'<b>'+username+':</b> '+msg.data});
    socket.broadcast.emit('message', {data:'<b>'+username+':</b> '+msg.data});
  });
  
  socket.on('sync', function(msg) {
    socket.broadcast.emit('synch', {data: msg.data});
  });
  
  socket.on('disconnect', function() {
    socket.broadcast.emit('message', {data:'<b>'+username+' has left the zone...</b>'});
  });
});
