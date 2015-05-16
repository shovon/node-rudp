var bufferEqual = require('./bufferEqual');

/**
 * Represents a packet.
 *
 * @class Packet
 * @constructor
 */
module.exports = Packet;
function Packet(sequenceNumber, payload, synchronize, reset) {
  if (Buffer.isBuffer(sequenceNumber)) {
    var segment = sequenceNumber;

    var offset = 0;

    bools = segment.readUInt8(offset); offset++;
    this._acknowledgement = !!(bools & 0x80);
    this._synchronize     = !!(bools & 0x40);
    this._finish          = !!(bools & 0x20);
    this._reset           = !!(bools & 0x10);

    this._sequenceNumber = segment.readUInt8(offset); offset++;
    this._payload = new Buffer(segment.length - offset);
    segment.copy(this._payload, 0, offset);
  } else {
    this._acknowledgement = false;
    this._synchronize = !!synchronize;
    this._finish = false;
    this._reset = !!reset;
    this._sequenceNumber = sequenceNumber;
    this._payload = payload;
  }
};

Packet.createAcknowledgementPacket = function (sequenceNumber) {
  var packet = new Packet(sequenceNumber, new Buffer(0), false);
  packet._acknowledgement = true;
  return packet;
};

Packet.createFinishPacket = function () {
  var packet = new Packet(0, new Buffer(0), false, false);
  packet._finish = true;
  return packet;
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

Packet.prototype.getIsReset = function () {
  return this._reset;
};

/**
 * Get a byte array based on the meta data.
 *
 * @method toBuffer
 */
Packet.prototype.toBuffer = function () {
  var offset = 0;
  var retval = new Buffer(2 + this._payload.length);

  var bools = 0 + (
    (this._acknowledgement && 0x80) |
    (this._synchronize     && 0x40) |
    (this._finish          && 0x20) |
    (this._reset           && 0x10)
  );

  retval.writeUInt8(bools, offset); offset++;
  retval.writeUInt8(this._sequenceNumber, offset); offset++;

  this._payload.copy(retval, offset, 0);

  return retval;
}

Packet.prototype.clone = function () {
  return new Packet(this.toBuffer());
};

Packet.prototype.toObject = function () {
  return {
    acknowledgement: this.getIsAcknowledgement(),
    synchronize: this.getIsSynchronize(),
    finish: this.getIsFinish(),
    reset: this.getIsReset(),
    sequenceNumber: this.getSequenceNumber(),
    payload: this.getPayload().toString('base64')
  }
};

Packet.prototype.equals = function (packet) {
  return (
    this.getIsAcknowledgement() === packet.getIsAcknowledgement() &&
    this.getIsSynchronize() === packet.getIsSynchronize() &&
    this.getIsFinish() === packet.getIsFinish() &&
    this.getIsReset() === packet.getIsReset() &&
    this.getSequenceNumber() === packet.getSequenceNumber() &&
    bufferEqual(this.getPayload(), packet.getPayload())
  )
};