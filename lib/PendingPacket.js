var constants = require('./constants');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * A placeholder for a packet that is awaiting an acknowledgement from the end
 * host.
 *
 * @class PendingPacket
 * @constructor
 */
module.exports = PendingPacket;
function PendingPacket(packet, packetSender) {
  this._packetSender = packetSender;
  this._packet = packet;
}

util.inherits(PendingPacket, EventEmitter);

PendingPacket.prototype.send = function () {
  var self = this;
  this._intervalID = setInterval(function () {
    self._packetSender.send(self._packet);
  }, constants.TIMEOUT);
  self._packetSender.send(self._packet);
};

PendingPacket.prototype.getSequenceNumber = function () {
  return this._packet.getSequenceNumber();
};

PendingPacket.prototype.acknowledge = function () {
  clearInterval(this._intervalID);
  this.emit('acknowledge');
};