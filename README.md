# rudp

Reliable UDP implementation for Node.js.

## Example

For a peer-to-peer application, you can write a script like this:

```javascript
var rudp = require('rudp');
var dgram = require('dgram');

var socket = dgram.createSocket('udp4');

socket.bind(localPort);

var client = new rudp.Client(socket, remoteAddress, remotePort);

// And do whatever you want here
```

No really; that above code will *actually* work, even if all hosts were sitting behind a NAT. Give it a try. For the heck of it, give rudp a try with [a file sharing example](https://bitbucket.org/shovonr/rudp-example).
