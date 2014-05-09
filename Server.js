var Packet = require('./Packet');
var Connection = require('./Connection');

// TODO: have this be a 

function Server(socket) {
  this._connections = {};
  var self = this;
  socket.on('message', function (message, rinfo) {
    var connection;
    if (!self._connections[rinfo.address + rinfo.port]) {
      connection = new Connection();
      self._connections[rinfo.address + rinfo.port] = connection;
      this.emit('connection', connection);
    } else {
      connection = self._connections[rinfo.address + rinfo.port];
    }
    var packet = new Packet(data);
    connection.receive(packet);
  });
};