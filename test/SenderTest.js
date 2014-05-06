var expect = require('expect.js');
var assert = require('assert');
var Sender = require('../Sender');
var constants = require('../constants');

describe('Sender', function () {
  describe('#Sender', function () {
    it('should have the baseSequence number initialized to be less than or equal to MAX_SIZE - WINDOW_SIZE, and be an integer', function () {
      var sender = new Sender();
      expect(sender._baseSequenceNumber).to.be(Math.floor(sender._baseSequenceNumber));
      assert(sender._baseSequenceNumber > 0 && sender._baseSequenceNumber < constants.MAX_SIZE - constants.WINDOW_SIZE);
    });
  });
});