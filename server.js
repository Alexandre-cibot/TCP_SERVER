var net = require('net');
var F = require('./functions.js');
var colors = require('colors');
var serverMode = process.argv[2] || 'prod';
var serverAddr = serverMode === 'dev' ? '127.0.0.1' : '51.255.44.197';
var serverPort = 6666;
var sockets = [];
 

var server = net.createServer(function(sock) {
    F.welcome(sock);
    // sock.name = sock.remoteAddress;
    getUserName(sock);
    sockets.push(sock);
 
    sock.on('data', function(data) {  // client writes message
        if (sock.name) {
            F.handleNewMessage(data, sockets, sock);
        } else {
            getUserName(sock, data);
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

function getUserName(sock, data = '') {
    if (!data) {
      sock.write('Please enter your name:'.magenta + '\n');
    }
    else {
      let name = data.toString('utf8').trim();
      name = name ? name : 'Un anonyme fdp';
      sock.name =  name;
      sock.write(colors.green(`Welcome to the channel ${name} \n`));
      sock.write(colors.yellow(`Nombre de connecté : ${sockets.length} \n`));
      F.serverBroadcast(sockets, sock, sock.name, 'has joined the conversation');
    }
}
