
var buffertools = require('buffertools')
module.exports = function bufferEqual(a, b) {
  return buffertools.compare(a, b) === 0
}