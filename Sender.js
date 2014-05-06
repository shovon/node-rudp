var helpers = require('./helpers');
var constants = require('./constants');

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
  this._baseSequenceNumber = Math.floor(Math.random() * (constants.MAX_SIZE - constants.WINDOW_SIZE));
}

/**
 * Sends data to the remote host. 
 *
 * @class Sender
 * @method
 */
Sender.prototype.send = function (data) {
  var chunks = helpers.splitArrayLike(data, 512);
  var windows = chunks.splitArrayLike(chunks, constants.WINDOW_SIZE);
  this._windows = this._windows.concat(windows);
  this._push();
}

/*
 * Pushes out the data to the remote host.
 */
Sender.prototype._push = function () {
  if (!this._sending) {
    var toSend = this._window.unshift().map(function (data) {

    });
    this._sending = this._window.unshift();
  }
}

/**
 * Verifies whether or not the acknowledgement number is in fact
 */
Sender.prototype.verifyAcknowledgement = function (sequenceNumber) {
  throw new Error('Not yet implemented');
}