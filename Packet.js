/**
 * Represents a packet.
 *
 * @class Packet
 * @constructor
 */
module.exports = Packet;
function Packet(sequenceNumber, payload, synchronize) {
  this._versionNumber = 0;

  if (sequenceNumber instanceof Buffer) {
    var segment = sequenceNumber;

    var offset = 0;
    this._versionNumber = segment.readUInt8(offset); offset++;

    bools = segment.readUInt8(offset); offset++;
    this._acknowledgement = !!(bools & 0x80);
    this._synchronize     = !!(bools & 0x40);
    this._finish          = !!(bools & 0x20);

    this._sequenceNumber = segment.readUInt8(offset); offset++;
    this._payload = new Buffer(segment.length - offset);
    segment.copy(this._payload, 0, offset);
  } else {
    this._acknowledgement = false;
    this._synchronize = !!synchronize;
    this._finish = false;
    this._sequenceNumber = sequenceNumber;
    this._payload = payload;
  }
};

Packet.createAcknowledgementPacket = function (sequenceNumber) {
  var packet = new Packet(sequenceNumber, new Buffer(0), false);
  packet._acknowledgement = true;
  return packet;
};

Packet.prototype.getVersionNumber = function () {
  return this._versionNumber;
};

Packet.prototype.getIsAcknowledgement = function () {
  return this._acknowledgement;
};

Packet.prototype.getIsSynchronize = function () {
  return this._synchronize;
};

Packet.prototype.getIsFinish = function () {
  return this._finish;
};

Packet.prototype.getSequenceNumber = function () {
  return this._sequenceNumber;
};

Packet.prototype.getPayload = function () {
  return this._payload;
};

/**
 * Get a byte array based on the meta data.
 *
 * @method toBuffer
 */
Packet.prototype.toBuffer = function () {
  var offset = 0;
  var retval = new Buffer(3 + this._payload.length);

  retval.writeUInt8(this._versionNumber, offset); offset++;

  var bools = 0 + (
    (this._acknowledgement && 0x80) |
    (this._synchronize     && 0x40) |
    (this._finish          && 0x20)
  );

  retval.writeUInt8(bools, offset); offset++;
  retval.writeUInt8(this._sequenceNumber, offset); offset++;

  this._payload.copy(retval, offset, 0);

  return retval;
}