var gobackn = require('../../');
var dgram = require('dgram');

var serverSocket = dgram.createSocket('udp4');
var clientSocket = dgram.createSocket('udp4');

// console.log('Initialized the sockets')

serverSocket.bind(3000);

console.log('Bound the server socket to port 3000');

var server = new gobackn.Server(serverSocket);
var client = new gobackn.Client(clientSocket, '127.0.0.1', 3000);

server.on('close', function () {
  serverSocket.close();
});

client.on('close', function () {
  clientSocket.close();
});

server.on('connection', function (connection) {
  connection.on('data', function (data) {
    console.log(data.toString('utf8'));
  });
});

client.send(new Buffer('Hello, World! alksdjflkjdaslfkjasldjflaskdjflsakjdf lsajd flk jsadlkf jsald fjlsad jflsdj flsakjd flsajd flsaj dflsajd flsjd flsajdf ljsa dlfj sdlkfj sladjf lasdjf lsakdj flasdjf lsakdjf lskadjf lsajd flsadjf lsadjf lsakdjf lsadkjf lasdj flasdjf alsdjf lsadj fsladj flsadj flsadkj fsaldj flsakdjf lsadjf lsakdj flskajd flskajdf lsadjf slakdfj slakdjf lsadjf lsdj fsladjf lsadjf lsadj flsadjf lskdjf lsakdjf lsadkjf lsadkjf sladkjf sladjf saldkfj saldkjf sladkjfaldfj asldfjs lfjksdf lsjdf lsdjf slafj sldfj slfj sdfjlksdfj lsadjkflsdjkf sldfkj sladfj slfkj asdlfkjsa dlfkjs adflkjsd lfj slkjdljals df jlsadfj lsadjf lsadj flsadj flsadj flksadjf lsadj flksadj flsd ajflsdka jflsadj flsadjf lskdj flsdj flsadj flksadj flksajd flksadj flksadj flsakdj flksadj flsadj flsadj flsakdj flksadj flsakdjf lsadkj flsadj flsadj flsadjf lsadjf lsakdfj sladkjf sladfj sladkjf sladkjf lsadkjf slakdjf lsdaj fsldfj lsadfj sladkjf sladkjf lsadkj flsdkjf sldkfj saldkjf lsakdjf lsakdjf sldkfj saldkfj asldfj sdlkfj sdlfj sdlfj adlfj saldfjk saldjkf sldfjk saldfkj saldjfk asldkfj sladkfj sldkjf sladjf lsadjk flsadkjf sladkjf lsdajf sdfadlfj sdfHello, World! alksdjflkjdaslfkjasldjflaskdjflsakjdf lsajd flk jsadlkf jsald fjlsad jflsdj flsakjd flsajd flsaj dflsajd flsjd flsajdf ljsa dlfj sdlkfj sladjf lasdjf lsakdj flasdjf lsakdjf lskadjf lsajd flsadjf lsadjf lsakdjf lsadkjf lasdj flasdjf alsdjf lsadj fsladj flsadj flsadkj fsaldj flsakdjf lsadjf lsakdj flskajd flskajdf lsadjf slakdfj slakdjf lsadjf lsdj fsladjf lsadjf lsadj flsadjf lskdjf lsakdjf lsadkjf lsadkjf sladkjf sladjf saldkfj saldkjf sladkjfaldfj asldfjs lfjksdf lsjdf lsdjf slafj sldfj slfj sdfjlksdfj lsadjkflsdjkf sldfkj sladfj slfkj asdlfkjsa dlfkjs adflkjsd lfj slkjdljals df jlsadfj lsadjf lsadj flsadj flsadj flksadjf lsadj flksadj flsd ajflsdka jflsadj flsadjf lskdj flsdj flsadj flksadj flksajd flksadj flksadj flsakdj flksadj flsadj flsadj flsakdj flksadj flsakdjf lsadkj flsadj flsadj flsadjf lsadjf lsakdfj sladkjf sladfj sladkjf sladkjf lsadkjf slakdjf lsdaj fsldfj lsadfj sladkjf sladkjf lsadkj flsdkjf sldkfj saldkjf lsakdjf lsakdjf sldkfj saldkfj asldfj sdlkfj sdlfj sdlfj adlfj saldfjk saldjkf sldfjk saldfkj saldjfk asldkfj sladkfj sldkjf sladjf lsadjk flsadkjf sladkjf lsdajf sdfadlfj sdfHello, World! alksdjflkjdaslfkjasldjflaskdjflsakjdf lsajd flk jsadlkf jsald fjlsad jflsdj flsakjd flsajd flsaj dflsajd flsjd flsajdf ljsa dlfj sdlkfj sladjf lasdjf lsakdj flasdjf lsakdjf lskadjf lsajd flsadjf lsadjf lsakdjf lsadkjf lasdj flasdjf alsdjf lsadj fsladj flsadj flsadkj fsaldj flsakdjf lsadjf lsakdj flskajd flskajdf lsadjf slakdfj slakdjf lsadjf lsdj fsladjf lsadjf lsadj flsadjf lskdjf lsakdjf lsadkjf lsadkjf sladkjf sladjf saldkfj saldkjf sladkjfaldfj asldfjs lfjksdf lsjdf lsdjf slafj sldfj slfj sdfjlksdfj lsadjkflsdjkf sldfkj sladfj slfkj asdlfkjsa dlfkjs adflkjsd lfj slkjdljals df jlsadfj lsadjf lsadj flsadj flsadj flksadjf lsadj flksadj flsd ajflsdka jflsadj flsadjf lskdj flsdj flsadj flksadj flksajd flksadj flksadj flsakdj flksadj flsadj flsadj flsakdj flksadj flsakdjf lsadkj flsadj flsadj flsadjf lsadjf lsakdfj sladkjf sladfj sladkjf sladkjf lsadkjf slakdjf lsdaj fsldfj lsadfj sladkjf sladkjf lsadkj flsdkjf sldkfj saldkjf lsakdjf lsakdjf sldkfj saldkfj asldfj sdlkfj sdlfj sdlfj adlfj saldfjk saldjkf sldfjk saldfkj saldjfk asldkfj sladkfj sldkjf sladjf lsadjk flsadkjf sladkjf lsdajf sdfadlfj sdf'));
client.close();