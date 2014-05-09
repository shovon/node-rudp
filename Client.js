var Receiver = require('./Receiver');
var Sender = require('./Sender');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = Client;
function Client(socket, address, port) {
  this._packetSender = new PacketSender();

  this._receiver = new Receiver();
  this._sender = new Sender();

  if (!address || !port) {
    throw new Error('An address and a port must be specified.');
  }
  this._sender = new Sender();
  socket.on('message', function (message, rinfo) {
    if (rinfo.address !== address || rinfo.port !== port) {
      return;
    }

  });
};

util.inherits(Client, EventEmitter);

Client.prototype.send = function (data) {
  this._sender.send(data);
};

Client.prototype.close = function () {
};