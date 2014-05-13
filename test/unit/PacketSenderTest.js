var PacketSender = require('../../lib/PacketSender');
var expect = require('expect.js');

describe('PacketSender', function () {
  describe('constructor', function () {
    it('should throw an error, absent a socket, an address and/or port', function () {

      expect(function () {
        new PacketSender();
      }).to.throwError();

      expect(function () {
        new PacketSender({});
      }).to.throwError();

      expect(function () {
        new PacketSender(undefined, 'test.com');
      }).to.throwError();

      expect(function () {
        new PacketSender(undefined, undefined, 4000);
      }).to.throwError();

      expect(function () {
        new PacketSender({}, 'test.com');
      }).to.throwError();

      expect(function () {
        new PacketSender({}, undefined, 4000);
      }).to.throwError();

      expect(function () {
        new PacketSender(undefined, 'test.com', 4000);
      }).to.throwError();

      new PacketSender({}, 'test.com', 4000);
    });
  });
});