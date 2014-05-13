var helpers = require('./helpers');
var constants = require('./constants');
var PendingPacket = require('./PendingPacket');
var Packet = require('./Packet');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// TODO: the sender should never send acknowledgement or finish packets.
// TODO: have the ability to cancel the transfer of any pending packet.

function Window(packets) {
  this._packets = packets;
}
util.inherits(Window, EventEmitter);

Window.prototype.send = function () {
  // Our packets to send.
  var pkts = this._packets.slice();

  // The initial synchronization packet. Always send this first.
  this._synchronizationPacket = pkts.shift();
  // The final reset packet. It can equal to the synchronization packet.
  this._resetPacket = pkts.length ? pkts.pop() : this._synchronizationPacket

  // This means that the reset packet's acknowledge event thrown will be
  // different from that of the synchronization packet.
  if (this._resetPacket !== this._synchronizationPacket) {
    this._resetPacket.on('acknowledge', function () {
      self.emit('done');
    });
  }

  var self = this;

  // Will be used to handle the case when all non sync or reset packets have
  // been acknowledged.
  var emitter = new EventEmitter();

  this._synchronizationPacket.on('acknowledge', function () {
    // We will either notify the owning class that this window has finished
    // sending all of its packets (that is, if this window only had one packet
    // in it), or keep looping through each each non sync-reset packets until
    // they have been acknowledged.

    if (self._resetPacket === self._synchronizationPacket) {
      self.emit('done');
      return;
    } else if (pkts.length === 0) {
      // This means that this window only had two packets, and the second one
      // was a reset packet.
      self._resetPacket.send();
      return;
    }

    emitter.on('acknowledge', function () {
      // This means that it is now time to send the reset packet.
      self._resetPacket.send();
    });

    // And if there are more than two packets in this window, then send all
    // other packets.

    var acknowledged = 0;

    function onAcknowledge() {
      acknowledged++;
      if (acknowledged === pkts.length) {
        emitter.emit('acknowledge');
      }
    }

    pkts.forEach(function (packet) {
      packet.on('acknowledge', onAcknowledge);
      packet.send();
    });
  });

  this._synchronizationPacket.send();
};

Window.prototype.verifyAcknowledgement = function (sequenceNumber) {
  for (var i = 0; i < this._packets.length; i++) {
    if (this._packets[i].getSequenceNumber() === sequenceNumber) {
      this._packets[i].acknowledge();
    }
  }
};

/**
 * An abstraction of sending raw UDP packets using the Go-Back-N protocol.
 *
 * @class Sender
 * @constructor
 */
module.exports = Sender;
function Sender(packetSender) {
  this._packetSender = packetSender;
  this._windows = [];
  this._sending = null;
}

/**
 * Sends data to the remote host. 
 *
 * @class Sender
 * @method
 */
Sender.prototype.send = function (data) {
  var chunks = helpers.splitArrayLike(data, constants.UDP_SAFE_SEGMENT_SIZE);
  var windows = helpers.splitArrayLike(chunks, constants.WINDOW_SIZE);
  this._windows = this._windows.concat(windows);
  this._push();
}

/*
 * Pushes out the data to the remote host.
 */
Sender.prototype._push = function () {
  var self = this;
  if (!this._sending && this._windows.length) {
    this._baseSequenceNumber = Math.floor(Math.random() * (constants.MAX_SIZE - constants.WINDOW_SIZE));
    var window = this._windows.shift()
    var toSend = new Window(window.map(function (data, i) {
      var packet = new Packet(i + self._baseSequenceNumber, data, !i, i === window.length - 1);
      return new PendingPacket(packet, self._packetSender);
    }));
    this._sending = toSend;
    var self = this;
    this._sending.on('done', function () {
      self._sending = null;
      self._push();
    });
    toSend.send();
  }
}

/**
 * Verifies whether or not the acknowledgement number is within the Window.
 *
 * @class Sender
 * @method
 */
Sender.prototype.verifyAcknowledgement = function (sequenceNumber) {
  if (this._sending) {
    this._sending.verifyAcknowledgement(sequenceNumber);
  }
}
