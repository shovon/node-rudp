var Receiver = require('../Receiver');
var expect = require('expect.js');
var Packet = require('../Packet');
var helpers = require('../helpers');
var sinon = require('sinon');

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
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
      var dummyData = 'Hello, World! This is a test!';
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data.toString('utf8');
      });
      receiver.on('end', function () {
        expect(compiled).to.be(dummyData);
        expect(spySender.sendPacket.callCount).to.be(1);
        done();
      });
      receiver.receive(new Packet(0, new Buffer(dummyData), true));
      receiver.end();
    });

    it('should deliver multiple unordered packets upstream just fine, and in order', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
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
        expect(spySender.sendPacket.callCount).to.be(16);
        done();
      });
      packets.forEach(function (packet) {
        receiver.receive(packet);
      });
      receiver.end();
    });

    it('should handle duplicate synchronize packets just fine', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
      var dummyData = 'Hello, World! HA';
      var packets = dummyData.split('').map(function (character, i) {
        return new Packet(i, new Buffer(character), i === 0);
      });
      var first = packets.shift();
      var firstCopy = first.clone();
      packets.push(firstCopy);
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
        expect(spySender.sendPacket.callCount).to.be(17);
        done();
      });
      packets.forEach(function (packet) {
        receiver.receive(packet);
      });
      receiver.end();
    });

    it('should handle duplicate packets just fine', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      }
      var receiver = new Receiver(spySender);
      var dummyData = 'Hello, World! HA';
      var packets = dummyData.split('').map(function (character, i) {
        return new Packet(i, new Buffer(character), i === 0);
      });
      var first = packets.shift();
      var packetClone = packets[Math.floor(Math.random() * packets.length)].clone();
      packets.push(packetClone);
      helpers.shuffle(packets);
      packets.unshift(first);
      expect(packets.map(function (element, i) {
        return element.getPayload().toString('utf8');
      }).join('')).to.not.be(dummyData);
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data.toString('utf8');
      });
      receiver.on('end', function () {
        expect(compiled).to.be(dummyData);
        expect(spySender.sendPacket.callCount).to.be(17);
        done();
      });
      packets.forEach(function (packet) {
        receiver.receive(packet);
      });
      receiver.end();
    });
  });
});
