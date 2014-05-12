/**
 * Created by joel on 2014-04-10.
 */
"use strict";
const
  zmq = require('zmq'),
  filename = process.argv[2],
  // create request endpoint
  requester = zmq.socket('req');

// handle replies from responder
requester.on("message", function (data) {
  var response = JSON.parse(data);
  console.log("Received response:", response);
});

requester.connect("tcp://localhost:5433");

// send request for content
for (var i = 0; i < 5; i++) {
  console.log('Sending request for ' + filename);
  requester.send(JSON.stringify({
    path: filename
  }));
}