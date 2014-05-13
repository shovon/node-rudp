var gobackn = require('../../lib');
var dgram = require('dgram');

var serverSocket = dgram.createSocket('udp4');
var middleSocket = dgram.createSocket('udp4');
var clientSocket = dgram.createSocket('udp4');

clientSocket.bind(2000);
middleSocket.bind(4000);
serverSocket.bind(3000);

middleSocket.on('message', function (message, rinfo) {
  if (Math.random() > 0.2) {
    return;
  }
  setTimeout(function () {
    if (rinfo.port === 2000) {
      middleSocket.send(message, 0, message.length, 3000, '127.0.0.1');
    } else if (rinfo.port === 3000) {
      middleSocket.send(message, 0, message.length, 2000, '127.0.0.1');
    }
  }, Math.floor(Math.random() * 800));
});

console.log('Bound the server socket to port 3000');

var server = new gobackn.Server(serverSocket);
var client = new gobackn.Client(clientSocket, '127.0.0.1', 4000);

server.on('close', function () {
  serverSocket.close();
});

client.on('close', function () {
  clientSocket.close();
});

server.on('connection', function (connection) {
  connection.on('data', function (data) {
    console.log(data.toString('utf8'));
  });
});

client.send(new Buffer('Hello, World!'));
client.send(new Buffer('How are you doing?'));
