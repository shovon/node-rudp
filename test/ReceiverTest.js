var Receiver = require('../Receiver');
var expect = require('expect.js');
var Packet = require('../Packet');
var helpers = require('../helpers');

describe('Receiver', function () {
  // TODO: test whether the receiver is able to send acknowledgement packets.

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

    // TODO: test with non-zero initial sequence numbers.

    it('should deliver a single packet upstream just fine', function (done) {
      var receiver = new Receiver({
        sendPacket: function () {}
      });
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
      receiver.end();
    });

    it('should deliver multiple packets upstream just fine, and in order', function (done) {
      var receiver = new Receiver({
        sendPacket: function () {} // TODO: test whether this function is called.
      });
      var dummyData = 'Hello, World! HA';
      var packets = dummyData.split('').map(function (character, i) {
        return new Packet(i, new Buffer(character), i === 0);
      });
      var first = packets.shift();
      helpers.shuffle(packets);
      packets.unshift(first);
      expect(packets.map(function (element) {
        return element.getPayload().toString('utf8');
      }).join('')).to.not.be(dummyData);
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data.toString('utf8');
      });
      receiver.on('end', function () {
        expect(compiled).to.be(dummyData);
        done();
      });
      packets.forEach(function (packet) {
        receiver.receive(packet);
      });
      receiver.end();
    });

    // TODO: test this.

    it.only('should handle duplicate synchronize packets just fine', function (done) {
      throw new Error('Not yet spec\'d');
      var receiver = new Receiver({
        sendPacket: function () {} // TODO: test whether this function is called.
      });
      var dummyData = 'Hello, World! HA';
      var packets = dummyData.split('').map(function (character, i) {
        return new Packet(i, new Buffer(character), i === 0);
      });
      var first = packets.shift();
      var firstCopy = first.clone();
      helpers.push(firstCopy);
      helpers.shuffle(packets);
      packets.unshift(first);
      expect(packets.map(function (element) {
        return element.getPayload().toString('utf8');
      }).join('')).to.not.be(dummyData);
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data.toString('utf8');
      });
      receiver.on('end', function () {
        expect(compiled).to.be(dummyData);
        done();
      });
      packets.forEach(function (packet) {
        receiver.receive(packet);
      });
      receiver.end();
    });
  });
});