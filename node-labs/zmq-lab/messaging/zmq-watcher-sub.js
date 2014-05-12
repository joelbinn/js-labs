/**
 * Created by joel on 2014-04-10.
 */
"use strict";
const
  zmq = require('zmq'),
  // create subscriber endpoint
  subscriber = zmq.socket('sub'); // subscribe to all messages

subscriber.subscribe("");

// handle messages from publisher
subscriber.on("message", function (data) {
  var
    message = JSON.parse(data),
    date = new Date(message.timestamp);
  console.log("File '" + message.file + "' changed at " + date);
});

// connect to publisher
subscriber.connect("tcp://localhost:5432");