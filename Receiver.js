var LinkedList = require('./LinkedList');
var constants = require('./constants');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// TODO: have this be a DuplexStream instead of an EventEmitter.
// TODO: the Receiver should never send raw packets to the end host. It should
//     only be acknowledgement packets. Please see [1]

module.exports = Receiver;
function Receiver(packetSender) {
  this._synced = false;
  this._nextSequenceNumber = 0;
  this._packets = new LinkedList(function (packetA, packetB) {
    return packetA.getSequenceNumber() - packetB.getSequenceNumber();
  });
  this._packetSender = packetSender;
  this._closed = false;
}
util.inherits(Receiver, EventEmitter);

Receiver.prototype.receive = function (packet) {
  if (this._closed) {
    // Since this is closed, don't do anything.
    return;
  }

  // TODO: ignore packets that have a sequence number less than the next
  // next sequence number

  if (packet.synchronize) {
    // This is the beginning of the stream.

    // This must be set to true, otherwise, the packet will not be accepted.
    this._synced = true;

    // Clear all existing packets.
    this._packets.clear();

    // When the next packet arrives, it had better be the following sequence
    // number, otherewise, we won't be sending an acknowledgment packet for it
    // until a sequence number preceding it has been sent.
    this._nextSequenceNumber = packet.getSequenceNumber() + 1;
    this._notifyData(this._packets.currentValue());
    
    // We're done.
    return;
  } else if (!this._synced) {
    return;
  } else if (
    packet.getSequenceNumber() >
    this._packets.currentValue().getSequenceNumber() + constants.WINDOW_SIZE
  ) {
    // This is to prevent stack overflows.

    return;
  }

  // Insert the packet, and see if the data can be pushed upstream.
  this._packets.insert(packet);
  this._push();
};

Receiver.prototype._notifyData = function (packet) {
  this.emit('data', packet.getPayload());
};

Receiver.prototype.end = function () {
  this._closed = true;
  this.emit('end');
};

Receiver.prototype._push = function () {
  var packet = this._packets.nextValue();
  var sequenceNumber = packet.getSequenceNumber()
  if (sequenceNumber === this._nextSequenceNumber) {
    this._notifyData(packet);
    this._packets.seek();
    this._nextSequenceNumber++;
    // [1] There is a potential that the receiver can send raw packets by
    // mistake. One way to avoid this is to have the constructor only accept
    // a class that can only send acknowledgement packets.
    this._packetSender.sendPacket(Packet.createAcknowledgementPacket(sequenceNumber));
    this._push();
  }
};
