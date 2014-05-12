#!/usr/local/bin/node --harmony

const express = require('express');
const app = express();

app.get('/echo/:name', function(req, res) {
  console.log('Request parameters: %o', req.params);
  res.send(req.params);
});

var server = app.listen(9180, function() {
  console.log('Listening on port %d', server.address().port);
});
