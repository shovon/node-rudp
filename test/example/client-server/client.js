var rudp = require('rudp');
var dgram = require('dgram');

var socket = dgram.createSocket('udp4');

var client = new rudp.Client(socket, 'someaddress', 5000);

process.stdin.resume();

process.stdin.on('data', function (data) {
  client.send(data);
});

client.on('data', function (data) {
  console.log(data.toString('utf8').trim());
});
