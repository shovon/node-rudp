var Packet = require('./Packet');
var Connection = require('./Connection');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var PacketSender = require('./PacketSender');

module.exports = Server;

/**
 * The constructor function for a "server" in our RUDP construct.
 * @param {dgram.Socket} socket Node.js' dgram.Socket.
 */
function Server(socket) {
  // A list of all connections.
  this._connections = {};

  var self = this;

  socket.on('message', function (message, rinfo) {
    var addressKey = rinfo.address + rinfo.port;
    var connection;

    // Get connection.
    if (!self._connections[addressKey]) {
      // Record a new connection to the list of connections.

      connection = new Connection(new PacketSender(socket, rinfo.address, rinfo.port));
      self._connections[addressKey] = connection;
      self.emit('connection', connection);
    } else {
      // Just get the existing connection.

      connection = self._connections[addressKey];
    }

    // Parse the message.
    var packet = new Packet(message);

    if (packet.getIsFinish()) {
      // The client requested that the connection be closed.

      delete self._connections[addressKey];
    } else {
      // Capture the packet, and place it into the window of packets.

      setImmediate(function () {
        connection.receive(packet);
      });
    }

  });
};

util.inherits(Server, EventEmitter);