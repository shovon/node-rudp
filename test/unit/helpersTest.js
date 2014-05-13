var helpers = require('../../lib/helpers.js');
var expect = require('expect.js');

describe('splitArrayLike', function () {
  it('should return an empty array for buffers of length 0', function () {
    expect(helpers.splitArrayLike(new Buffer([])).length).to.be(0);
  });
  it('should return an array with one element for buffers of the length specified', function () {
    var buf = helpers.splitArrayLike(new Buffer(16), 16);
    expect(buf.length).to.be(1);
    expect(buf[0].length).to.be(16);
  });
  it('should return an array with all elements having a length of the supplied length', function () {
    var length = 16;
    var numberOfChunks = 10;
    var chunks = helpers.splitArrayLike(new Buffer(length * numberOfChunks), length);

    expect(chunks.length).to.be(numberOfChunks);

    chunks.forEach(function (chunk) {
      expect(chunk.length).to.be(length);
    });
  });
  it('should return an array even for buffers where the number of bytes is not evenly divisible by the specified length of the chunk', function () {
    var length = 16;
    var numberOfChunks = 10;
    var extra = 10;

    var chunks = helpers.splitArrayLike(new Buffer(length * numberOfChunks + extra), length);

    expect(chunks.length).to.be(numberOfChunks + 1);
    chunks.forEach(function (chunk, i) {
      if (i === chunks.length - 1) {
        expect(chunk.length).to.be(extra);
      } else {
        expect(chunk.length).to.be(length);
      }
    });
  });
});