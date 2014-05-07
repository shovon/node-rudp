var Receiver = require('../Receiver');
var expect = require('expect.js');

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
});