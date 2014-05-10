var constants = require('./constants');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * A placeholder for a packet that is awaiting a acknowledgement from the end
 * host.
 *
 * @class PendingPacket
 * @constructor
 */
module.exports = PendingPacket;
function PendingPacket(packet, packetSender) {
  this._packet = packet;
  this._intervalID = setInterval(function () {
    packetSender.send(packet);
  }, constants.TIMEOUT);
}

util.inherits(PendingPacket, EventEmitter);

PendingPacket.prototype.getSequenceNumber = function () {
  return this._packet.getSequenceNumber();
};

PendingPacket.prototype.acknowledge = function () {
  clearInterval(this._intervalID);
  this.emit('acknowledge');
};