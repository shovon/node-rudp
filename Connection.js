var Sender = require('./Sender');
var Receiver = require('./Receiver');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = Connection;
function Connection(packetSender) {
  this._sender = new Sender(packetSender);
  this._receiver = new Receiver(packetSender);
};

util.inherits(Connection, EventEmitter);

Connection.prototype.send = function (data) {
  console.log('Sending data.');
  this._sender.send(data);
};

Connection.prototype.receive = function (packet) {
  console.log('Got a packet.');
  if (packet.getIsAcknowledgement()) {
    console.log('This is an acknowledgement packet');
    this._sender.verifyAcknowledgement(packet.getSequenceNumber());
  } else {
    console.log('This is a regular packet');
    this._receiver.receive(packet);
  }
};
