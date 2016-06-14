#! /usr/bin/env node

"use strict";

const express = require('express'),
      bodyParser = require('body-parser'),
      Bolt = require('misfit-bolt'),
      debug = require('debug')(require('./package').name),
      argv = require('minimist')(process.argv.slice(2)),
      util = require('./lib/util'),
      ucfirst = util.ucfirst,
      assert = util.assert,
      errorHandler = util.errorHandler,
      responseHandler = util.responseHandler,
      errors = require('./lib/errors'),
      NotFound = errors.NotFound,
      BadRequest = errors.BadRequest,
      ServerError = errors.ServerError;

const app = express(),
      port = parseInt(argv.p, 10) || 3000,
      actions = ['state', 'hue', 'saturation', 'brightness'];

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

    try {
      const method = `get${ucfirst(name)}`,
          id = req.params.id,
          bolt = Bolt.get(id);
      assert(bolt, NotFound, `cannot find Bolt with id ${id}`);

      debug(`${method} called for ${id}`);
      bolt.connect(() => {
        bolt[method]((err, value) => {
          debug(`${method} returned value: ${value}`);
          responseHandler(res, name, value);
        });
      });
    } catch (err) {
      debug(`error ${err}`);
      errorHandler(err, res);
    }

  });

  app.put(`/:id/${name}`, (req, res) => {

    try {
      const method = `set${ucfirst(name)}`,
            id = req.params.id,
            bolt = Bolt.get(id);
      assert(bolt, NotFound, `cannot find Bolt with id ${id}`);
      assert(req.body && req.body[name] !== undefined, BadRequest, `missing value for ${name}`);

      const value = req.body[name];
      debug(`${method} called for ${id} with ${value}`);
      bolt.connect(() => {
        bolt[method](value, (err) => {
          responseHandler(res, name, value);
        });
      });
    } catch (err) {
      debug(`error ${err.status}, ${err.message}`);
      errorHandler(err, res);
    }

  });

});

Bolt.discover();
