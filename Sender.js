var helpers = require('./helpers');
var constants = require('./constants');
var PendingPacket = require('./PendingPacket');

/**
 * An abstraction of sending raw UDP packets using the Go-Back-N protocol.
 *
 * @class Sender
 * @constructor
 */
module.exports = Sender;
function Sender() {
  this._windows = [];
  this._sending = null;
  //
}

/**
 * Sends data to the remote host. 
 *
 * @class Sender
 * @method
 */
Sender.prototype.send = function (data) {
  var chunks = helpers.splitArrayLike(data, constants.UDP_SAFE_SEGMENT_SIZE);
  var windows = chunks.splitArrayLike(chunks, constants.WINDOW_SIZE);
  this._windows = this._windows.concat(windows);
  this._push();
}

/*
 * Pushes out the data to the remote host.
 */
Sender.prototype._push = function () {
  if (!this._sending) {
    this._baseSequenceNumber = Math.floor(Math.random() * (constants.MAX_SIZE - constants.WINDOW_SIZE));
    var toSend = this._window.unshift().map(function (data, i) {
      return new PendingPacket(new Packet(i + this.baseSequenceNumber, data));
    });
    this._sending = toSend;
  }
}

/**
 * Verifies whether or not the acknowledgement number is within the Window.
 *
 * @class Sender
 * @method
 */
Sender.prototype.verifyAcknowledgement = function (sequenceNumber) {
  throw new Error('Not yet implemented');
}