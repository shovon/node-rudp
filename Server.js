var Packet = require('./Packet');
var Connection = require('./Connection');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var PacketSender = require('./PacketSender');

module.exports = Server;
function Server(socket) {
  this._connections = {};
  var self = this;
  socket.on('message', function (message, rinfo) {
    console.log('Got a message.');
    var addressKey = rinfo.address + rinfo.port;
    var connection;
    if (!self._connections[addressKey]) {
      console.log('New client.');
      connection = new Connection(new PacketSender(socket, rinfo.address, rinfo.port));
      self._connections[addressKey] = connection;
      this.emit('connection', connection);
    } else {
      console.log('Old client.');
      connection = self._connections[addressKey];
    }
    var packet = new Packet(message);
    if (packet.getIsFinish()){
      delete self._connections[addressKey];
    } else {
      connection.receive(packet);
    }
  });
  console.log('Listening for messages sent by clients.');
};

util.inherits(Server, EventEmitter);