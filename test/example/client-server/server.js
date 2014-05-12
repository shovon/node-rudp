var gobackn = require('gobackn');
var dgram = require('dgram');

var socket = dgram.createSocket('udp4');

socket.bind(5000);

var server = new gobackn.Server(socket);

process.stdout.resume();

var connections = [];

process.stdout.on('data', function (data) {
  connections.forEach(function (connection) {
    connection.send(data);
  });
});

server.on('connection', function (connection) {
  connections.push(connection);
  server.on('data', function (data) {
    console.log(data.toString('utf8'));
  });
});
