/**
 * Created by joel on 2014-04-10.
 */
'use strict';
const
  fs = require('fs'),
  zmq = require('zmq'),
// socket to reply to client requests
  responder = zmq.socket('rep');
// handle incoming requests
responder.on('message', function (data) {
  // parse incoming message
  var request = JSON.parse(data);
  console.log('Received request to get: ' + request.path);
  // read file and reply with content
  fs.readFile(request.path, function (err, content) {
    console.log('Sending response content');
    responder.send(JSON.stringify({
      content: content.toString(),
      timestamp: Date.now(),
      pid: process.pid
    }));
  });
});

// listen on TCP port 5433
responder.bind('tcp://127.0.0.1:5433', function (err) {
  console.log('Listening for zmq requesters...');
});

// close the responder when the Node process ends
process.on('SIGINT', function () {
  console.log('Shutting down...');
  responder.close();
});