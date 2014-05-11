var Sender = require('./Sender');
var Receiver = require('./Receiver');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = Connection;
function Connection(packetSender) {
  this._sender = new Sender(packetSender);
  this._receiver = new Receiver(packetSender);

  var self = this;
  this._receiver.on('data', function (data) {
    self.emit('data', data)
  });
};

util.inherits(Connection, EventEmitter);

Connection.prototype.send = function (data) {
  // console.log('Sending data.');
  this._sender.send(data);
};

Connection.prototype.receive = function (packet) {
  // console.log('Got a packet.');
  if (packet.getIsAcknowledgement()) {
    this._sender.verifyAcknowledgement(packet.getSequenceNumber());
  } else {
    this._receiver.receive(packet);
  }
};
