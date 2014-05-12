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
    var addressKey = rinfo.address + rinfo.port;
    var connection;
    if (!self._connections[addressKey]) {
      connection = new Connection(new PacketSender(socket, rinfo.address, rinfo.port));
      self._connections[addressKey] = connection;
      self.emit('connection', connection);
    } else {
      connection = self._connections[addressKey];
    }
    var packet = new Packet(message);
    if (packet.getIsFinish()){
      delete self._connections[addressKey];
    } else {
      setImmediate(function () {
        connection.receive(packet);
      });
    }
  });
};

util.inherits(Server, EventEmitter);