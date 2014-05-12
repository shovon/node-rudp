var gobackn = require('gobackn');
var dgram = require('dgram');

var socket = dgram.createSocket('udp4');

var client = new gobackn.Client(socket, '127.0.0.1', 5000);

process.stdout.resume();

process.stdout.on('data', function (data) {
  client.send(data);
});

client.on('data', function (data) {
  console.log(data.toString('utf8').trim());
});