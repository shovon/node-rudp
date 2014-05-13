module.exports = PacketSender;
function PacketSender(socket, address, port) {
  if (!socket || !address || !port) {
    throw new Error('Expecting a socket, address, and a port.');
  }
  this._socket = socket;
  this._address = address;
  this._port = port;
};

PacketSender.prototype.send = function (packet) {
  var buffer = packet.toBuffer();
  this._socket.send(buffer, 0, buffer.length, this._port, this._address);
};