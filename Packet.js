/**
 * Represents a packet
 */
function Packet(sequenceNumber, payload, synchronize) {
  this._versionNumber = 0;

  if (sequenceNumber instanceof Buffer) {
    throw new Error('Not yet implemented');
  } else {
    this._acknowledgement = false;
    this._synchronize = !!synchronize;
    this._finish = false;
    this._sequenceNumber = sequenceNumber;
    this._payload = payload;
  }
}

Packet.prototype.toByte = function () {
  var offset = 0;
  var retval = new Buffer(512);

  retval.writeUInt8(this._versionNumber); offset++;
}