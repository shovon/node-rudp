var Receiver = require('../Receiver');
var expect = require('expect.js');
var Packet = require('../Packet');

describe('Receiver', function () {
  describe('#_closed, #end() and event end', function () {
    it('should trigger an event called end', function (done) {
      var receiver = new Receiver();
      expect(receiver._closed).to.be(false);
      receiver.on('end', function () {
        expect(receiver._closed).to.be(true);
        done();
      });
      receiver.end();
    });
  });
  describe('#receive', function () {
    it('a single packet should be delivered upstream just fine', function (done) {
      var receiver = new Receiver();
      var dummyData = 'Hello, World! This is a test!';
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data.toString('utf8');
      });
      receiver.on('end', function () {
        expect(compiled).to.be(dummyData);
        done();
      });
      receiver.receive(new Packet(0, new Buffer(dummyData), true));
    });
  });
});