function Connection() {
  this._sender = new Sender();
  this._receiver = new Receiver();
};

Connection.prototype.send = function (data) {
  this._sender.send(data);
};

Connection.prototype.receive = function (packet) {
  
};