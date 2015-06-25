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
