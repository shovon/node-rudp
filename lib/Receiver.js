var LinkedList = require('./LinkedList');
var constants = require('./constants');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Packet = require('./Packet');

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

  // Ignores packets that have a sequence number less than the next sequence
  // number
  if (!packet.getIsSynchronize() && packet.getSequenceNumber() < this._syncSequenceNumber) {
    return;
  }

  if (packet.getIsSynchronize() && !this._synced) {
    // This is the beginning of the stream.

    if (packet.getSequenceNumber() === this._syncSequenceNumber) {
      this._packetSender.send(Packet.createAcknowledgementPacket(packet.getSequenceNumber()));
      return;
    }

    // Send the packet upstream, send acknowledgement packet to end host, and
    // increment the next expected packet.
    this._packets.clear();
    this.emit('data', packet.getPayload());
    this._packetSender.send(Packet.createAcknowledgementPacket(packet.getSequenceNumber()));
    this._packets.insert(packet);
    this._nextSequenceNumber = packet.getSequenceNumber() + 1;
    this._synced = true;
    this._syncSequenceNumber = packet.getSequenceNumber();


    if (packet.getIsReset()) {
      this.emit('_reset');
      this._synced = false;
    }

    // We're done.
    return;

  } else if (packet.getIsReset()) {
    this.emit('_reset');
    this._synced = false;
  } else if (!this._synced) {
    // If we are not synchronized with sender, then this means that we should
    // wait for the end host to send a synchronization packet.

    // We are done.
    return;
  } else if (packet.getSequenceNumber() < this._syncSequenceNumber) {
    // This is a troll packet. Ignore it.

    return;
  } else if (
    packet.getSequenceNumber() >=
    this._packets.currentValue().getSequenceNumber() + constants.WINDOW_SIZE
  ) {
    // This means that the next packet received is not within the window size.

    this.emit('_window_size_exceeded');
    return;
  }

  // This means that we should simply insert the packet. If the packet's
  // sequence number is the one that we were expecting, then send it upstream,
  // acknowledge the packet, and increment the next expected sequence number.
  //
  // Once acknowledged, check to see if there aren't any more pending packets
  // after the current packet. If there are, then check to see if the next
  // packet is the expected packet number. If it is, then start the
  // acknowledgement process anew.

  var result = this._packets.insert(packet);
  if (result === LinkedList.InsertionResult.INSERTED) {
    this._pushIfExpectedSequence(packet);
  } else if (result === LinkedList.InsertionResult.EXISTS) {
    this._packetSender.send(Packet.createAcknowledgementPacket(packet.getSequenceNumber()));
  }
};

Receiver.prototype._pushIfExpectedSequence = function (packet) {
  if (packet.getSequenceNumber() === this._nextSequenceNumber) {
    this.emit('data', packet.getPayload());
    // [1] Never send packets directly!
    this._packetSender.send(Packet.createAcknowledgementPacket(packet.getSequenceNumber()));
    this._nextSequenceNumber++;
    this._packets.seek();
    if (this._packets.hasNext()) {
      this._pushIfExpectedSequence(this._packets.nextValue());
    }
  }
};

Receiver.prototype.end = function () {
  this._closed = true;
  this.emit('end');
};
