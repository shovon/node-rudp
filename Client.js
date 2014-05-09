
function Client(socket, address, port) {
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
}

Client.prototype.write = function (data) {
  this._sender.write(data);
};