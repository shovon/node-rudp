var gobackn = require('../../');
var dgram = require('dgram');

var serverSocket = dgram.createSocket('udp4');
var clientSocket = dgram.createSocket('udp4');

serverSocket.bind(3000);

var server = new gobackn.Server(serverSocket);
var client = new gobackn.Client(clientSocket, '127.0.0.1', 3000);

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
client.close();