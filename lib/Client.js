var Receiver = require('./Receiver');
var Sender = require('./Sender');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var PacketSender = require('./PacketSender');
var Packet = require('./Packet');
var Connection = require('./Connection');

module.exports = Client;
function Client(socket, address, port) {
  // TODO: this is redundant, if the following call to the PacketSender
  //   constructor is going to throw that error.
  if (!address || !port) {
    throw new Error('An address and a port must be specified.');
  }

  this._packetSender = new PacketSender(socket, address, port);
  this._connection = new Connection(this._packetSender);

  var self = this;
  this._connection.on('data', function (data) {
    self.emit('data', data);
  });

  socket.on('message', function (message, rinfo) {
    if (rinfo.address !== address || rinfo.port !== port) {
      return;
    }
    var packet = new Packet(message);
    if (packet.getIsFinish()) {
      socket.close();
      return;
    }
    self._connection.receive(packet);
  });
};

util.inherits(Client, EventEmitter);

Client.prototype.send = function (data) {
  this._connection.send(data);
};

Client.prototype.close = function () {
  this._packetSender.send(Packet.createFinishPacket());
};
