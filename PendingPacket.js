var constants = require('./constants');

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

PendingPacket.prototype.getSequenceNumber = function () {
  return this._packet.getSequenceNumber();
};

PendingPacket.prototype.finish = function () {
  clearInterval(this._intervalID);
};