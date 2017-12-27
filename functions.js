// Using this module require 'colors' in the parent.
module.exports = {
  welcome(sock) {
    sock.write('Welcome to the Alexander\'s TCP chat.'.magenta + '\n');
    sock.write('To quit the connection enter: '.yellow +  'exit'.red + '\n');
  },
  killClient(sockets, sock) {
    console.log('Disconnected: ' + sock.name + '\n');
    sock.destroy();
    var idx = sockets.indexOf(sock);
    console.log(sockets.length);
    sockets.splice(idx, 1);
    console.log(sockets.length);
    console.log('Current users number: '.magenta + sockets.length);
    this.serverBroadcast(sockets, sock, sock.name, 'has left the conversation');
    return;
  },
  broadcast(sockets, sock, text) {
    sockets.forEach((socket) => {
      if (socket !== sock) {
        var intro = sock.name + "[" + this.getDate() + "]: ";
        var content = (text + '\n');
        socket.write(intro.cyan + content);
      }
    })
  },
  serverBroadcast(sockets, sock, name, text) {
    sockets.forEach((socket) => {
      // if (sokcet !== sock) {
        socket.write(name.cyan + ' ' + text.magenta + '\n');
      // }
    })
  },
  getDate() {
    let date = new Date();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    return `${hour}:${minutes}`;
  },
  handleNewMessage(data, sockets, sock) {
    let text = data.toString('utf8').trim();
    if (!text) return;
    console.log(`${sock.name} says: ${text}`);
    if (text == 'exit') {
      this.killClient(sockets, sock);
      return;
    }
    this.broadcast(sockets, sock, text);
  },
  getUserName(sockets, sock, data = '') {
    if (!data) {
      sock.write('Please enter your name:'.magenta + '\n');
    }
    else {
      let name = data.toString('utf8').trim();
      name = name ? name : 'Un anonyme fdp';
      sock.name = name;
      sock.write(`Welcome to the channel ${name} \n`.green);
      sock.write(`Nombre de connecté : ${sockets.length} \n`.yellow);
      this.serverBroadcast(sockets, sock, sock.name, 'has joined the conversation');
    }
  }
}
