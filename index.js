#! /usr/bin/env node

'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    Bolt = require('misfit-bolt'),
    debug = require('debug')(require('./package').name),
    actions = require('./lib/actions'),
    argv = require('minimist')(process.argv.slice(2));

var app = express(),
    port = parseInt(argv.p, 10) || 3000,
    bolts = [];

app.use(bodyParser.json());
app.listen(port, () => { console.log(`listening on port ${port}`); });

app.get('/', (req, res) => {
  res.send({bolts});
});

Bolt.discover(function(bolt) {
  debug(`New bolt discovered: ${bolt.id}`);
  bolts.push(bolt.id);
  actions(app, bolt);
});
