module.exports = PacketSender;
function PacketSender(socket, address, port) {
  this._socket = socket;
  this._address = address;
  this._port = port;
};

PacketSender.prototype.send = function (packet) {
  var buffer = packet.toBuffer();
  this._socket.send(buffer, 0, buffer.length, this._port, this._address);
};