var gobackn = require('../../lib');
var dgram = require('dgram');

var serverSocket = dgram.createSocket('udp4');
var clientSocket = dgram.createSocket('udp4');

serverSocket.bind(3001);

console.log('Bound the server socket to port 3001');

var server = new gobackn.Server(serverSocket);
var client = new gobackn.Client(clientSocket, '127.0.0.1', 3001);

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

  connection.send(new Buffer('Hello, Client!'));
});

client.on('data', function (data) {
  console.log('Client: %s', data.toString('utf8'));
});

client.send(new Buffer('Hello, World!'));
client.send(new Buffer('How are you doing?'));