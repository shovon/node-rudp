var constants = require('./constants');

/**
 * A placeholder for a packet that is awaiting a acknowledgement from the end
 * host.
 *
 * @class PendingPacket
 * @constructor
 */
function PendingPacket(packet, packetSender) {
  this._intervalID = setInterval(function () {
    packetSender.send(packet);
  }, constants.TIMEOUT);
}

PendingPacket.prototype.finish = function () {
  clearInterval(this._intervalID);
}