var fs = require('fs');
var path = require('path');

var files = fs.readdirSync(path.join(__dirname, 'unit'));

files.forEach(function (file) {
  require(path.join(__dirname, 'unit', file));
});