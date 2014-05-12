var Packet = require('../../lib/Packet');
var expect = require('expect.js');

describe('Packet', function () {
  describe('#Packet and #toBuffer', function () {
    it('should be able to create a new packet, output a buffer, and from it, create the packet again', function () {
      var sequenceNumber = 10;
      var isSynchronize = true
      var packet = new Packet(sequenceNumber, new Buffer('test'), isSynchronize);
      var generatedPacket = new Packet(packet.toBuffer());
      expect(generatedPacket.getIsAcknowledgement()).to.be(false);
      expect(generatedPacket.getIsSynchronize()).to.be(isSynchronize);
      expect(generatedPacket.getIsFinish()).to.be(false);
      expect(generatedPacket.getSequenceNumber()).to.be(sequenceNumber);
      expect(generatedPacket.getPayload().toString('utf8')).to.be('test');
    });
  });
  describe('#clone() and #equals()', function () {
    it('should clone the packet into two entirely different objects, yet have identical values. Equals should be able to determine equality, in-spite of different objects references', function () {
      var sequenceNumber = 10;
      var isSynchronize = true;
      var isReset = true;
      var packet = new Packet(sequenceNumber, new Buffer('test'), isSynchronize, isReset);
      var packetCopy = packet.clone();
      expect(packet).to.not.be(packetCopy);
      expect(packet.equals(packetCopy)).to.be(true);
    });
  });
});