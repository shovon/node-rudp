var Sender = require('./Sender');
var Receiver = require('./Receiver');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// TODO: have connections refuse packets when closed.

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

/**
 * Sends the given buffer to the end host.
 * @param {Buffer} data The buffer to send to the end host.
 */
Connection.prototype.send = function (data) {
  this._sender.send(data);
};

/**
 * This is the function called by `Server` and `Client` to process packets as
 * they arrive.
 * @param {Packet} packet Is a single packet received from an endpoint.
 */
Connection.prototype.receive = function (packet) {
  if (packet.getIsAcknowledgement()) {
    this._sender.verifyAcknowledgement(packet.getSequenceNumber());
  } else {
    this._receiver.receive(packet);
  }
};
