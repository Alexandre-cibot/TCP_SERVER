var net = require('net');
var colors = require('colors');
var F = require('./functions.js');
var serverMode = process.env.NODE_ENV || 'prod';
var serverAddr = serverMode === 'dev' ? '127.0.0.1' : '51.255.44.197';
var serverPort = 6666;
var sockets = [];
 

var server = net.createServer(function(sock) {
    F.welcome(sock);
    // sock.name = sock.remoteAddress;
    F.getUserName(sockets, sock);
    sockets.push(sock);
 
    sock.on('data', function(data) {  // client writes message
        if (sock.name) {
            F.handleNewMessage(data, sockets, sock);
        } else {
            F.getUserName(sockets, sock, data);
        }
    });
 
    sock.on('close', function() { // client disconnects
      if (sockets[sockets.indexOf(sock)]) {
         F.killClient(sockets, sock);
      }
    });
}); 

 
server.listen(serverPort, serverAddr);
console.log(`Server ${serverMode} created at ${serverAddr}:${serverPort} \n`);
