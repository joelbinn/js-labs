/**
 * Created by joel on 2014-04-10.
 */
'use strict';
const
  fs = require('fs'),
  zmq = require('zmq'),
  // create publisher endpoint
  publisher = zmq.socket('pub'),
  filename = process.argv[2];

fs.watch(filename, function () {
  // send message to any subscribers
  console.log('change');
  publisher.send(JSON.stringify({ type: 'changed',
    file: filename,
    timestamp: Date.now()
  }));
});

// listen on TCP port 5432
publisher.bind('tcp://*:5432', function (err) {
  console.log('Listening for zmq subscribers...');
});
