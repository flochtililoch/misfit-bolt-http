#! /usr/bin/env node

'use strict';

const express = require('express'),
      bodyParser = require('body-parser'),
      Bolt = require('misfit-bolt'),
      debug = require('debug')(require('./package').name),
      argv = require('minimist')(process.argv.slice(2));

const app = express(),
      port = parseInt(argv.p, 10) || 3000,
      actions = ['state', 'hue', 'saturation', 'brightness'],
      ucfirst = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
      };

app.use(bodyParser.json());
app.listen(port, () => { console.log(`listening on port ${port}`); });

app.get('/', (req, res) => {
  const bolts = Bolt.bolts.map((bolt) => {
    return {
      id: bolt.id,
      connected: bolt.connected
    };
  });
  res.send({bolts});
});

actions.forEach((name) => {

  app.get(`/:id/${name}`, (req, res) => {
    const method = `get${ucfirst(name)}`,
          bolt = Bolt.get(req.params.id);
    if (bolt) {
      debug(`${method} called for ${req.params.id}`);
      bolt.connect(() => {
        bolt[method]((err, value) => {
          debug(`${method} returned value: ${value}`);
          var body = {};
          body[name] = value;
          res.send(body);
        });
      });
    } else {
      res.status(404).end();
    }
  });

  app.put(`/:id/${name}`, (req, res) => {
    const method = `set${ucfirst(name)}`,
          bolt = Bolt.get(req.params.id);
    if (bolt) {
      debug(`${method} called for ${req.params.id}`);
      bolt.connect(() => {
        bolt[method](req.body ? req.body[name] : undefined, (err) => {
          res.end();
        });
      });
    } else {
      res.status(404).end();
    }
  });

});

Bolt.discover();
