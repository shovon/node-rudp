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

    it('should deliver multiple unordered packets upstream just fine, and in order, even with a non-zero intial sequence number.', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
      var dummyData = 'Hello, World! HA';
      var packets = dummyData.split('').map(function (character, i) {
        return new Packet(i + 64, new Buffer(character), i === 0);
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

    it('should be able to handle resets and synchronization', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
      var expected = 'Hello, World! This is a test!';
      var dummyData = helpers.splitArrayLike(expected, 16);
      var windows = dummyData.map(function (window, i) {
        var withPackets = window.split('').map(function (character, j) {
          return new Packet(j + 64 / (i + 1), new Buffer(character), j === 0, j === window.length - 1);
        });
        var tail = withPackets.shift();
        var head = withPackets.pop();
        helpers.shuffle(withPackets);
        withPackets.unshift(tail);
        withPackets.push(head);
        return withPackets;
      });
      var resetSpy = sinon.spy();
      receiver.on('_reset', function () {
        resetSpy();
      });
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data.toString('utf8');
      });
      receiver.on('end', function () {
        expect(compiled).to.be(expected);
        expect(spySender.sendPacket.callCount).to.be(expected.length);
        done();
      });
      windows.forEach(function (window) {
        window.forEach(function (packet) {
          receiver.receive(packet);
        });
      });
      receiver.end();
    });

    it('should handle duplicate reset packets', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
      var expected = 'Hello, World! This is a test!';
      var dummyData = helpers.splitArrayLike(expected, 16);
      var windows = dummyData.map(function (window, i) {
        var withPackets = window.split('').map(function (character, j) {
          return new Packet(j + 64 / (i + 1), new Buffer(character), j === 0, j === window.length - 1);
        });
        var tail = withPackets.shift();
        var head = withPackets.pop();
        var headCopy = head.clone();
        helpers.shuffle(withPackets);
        withPackets.unshift(tail);
        withPackets.push(head);
        withPackets.push(headCopy);
        return withPackets;
      });
      var resetSpy = sinon.spy();
      receiver.on('_reset', function () {
        resetSpy();
      });
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data.toString('utf8');
      });
      receiver.on('end', function () {
        expect(compiled).to.be(expected);
        expect(spySender.sendPacket.callCount).to.be(expected.length + 2);
        done();
      });
      windows.forEach(function (window) {
        window.forEach(function (packet) {
          receiver.receive(packet);
        });
      });
      receiver.end();
    });

    it('should be able to accept singleton windows', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
      var expected = 'Hello, World!';
      var dummyData = expected.split('');
      var windows = dummyData.map(function (packet, i) {
        return new Packet(i, new Buffer(packet), true, true);
      });
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data;
      });
      receiver.on('end', function () {
        expect(compiled).to.be(expected);
        done();
      });
      windows.forEach(function (packet) {
        receiver.receive(packet);
      });
      receiver.end();
    });

    it('should be able to accept duplicate singletons', function (done) {
      var spySender = {
        sendPacket: sinon.spy()
      };
      var receiver = new Receiver(spySender);
      var expected = 'Hello, World!';
      var dummyData = expected.split('');
      var windows = dummyData.map(function (packet, i) {
        return new Packet(i, new Buffer(packet), true, true);
      });
      var index = Math.floor(Math.random() * windows.length);
      var duplicate = windows[index].clone();
      var left = windows.slice(0, index);
      var right = windows.slice(index, windows.length);
      left.push(duplicate);
      windows = left.concat(right);
      var compiled = '';
      receiver.on('data', function (data) {
        compiled += data;
      });
      receiver.on('end', function () {
        expect(compiled).to.be(expected);
        done();
      });
      windows.forEach(function (packet) {
        receiver.receive(packet);
      });
      receiver.end();
    });
  });
});
