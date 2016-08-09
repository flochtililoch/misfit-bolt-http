#! /usr/bin/env node

"use strict";

const express = require('express'),
      bodyParser = require('body-parser'),
      Bolt = require('misfit-bolt'),
      async = require('async'),
      debug = require('debug')(require('./package').name),
      argv = require('minimist')(process.argv.slice(2)),
      util = require('./lib/util'),
      errors = require('./lib/errors'),
      ucfirst = util.ucfirst,
      assert = util.assert,
      errorHandler = util.errorHandler,
      NotFound = errors.NotFound,
      BadRequest = errors.BadRequest;

const app = express(),
      port = parseInt(argv.p, 10) || 3000;

app.use(bodyParser.json());
app.listen(port, () => { console.log(`listening on port ${port}`); });

app.get('/', (_, response) => {
  const bolts = Bolt.bolts.map((bolt) => {
    return {
      id: bolt.id,
    };
  });
  response.send({bolts});
});

app.get(`/:id`, (request, response) => {
  try {
    const id = request.params.id,
          bolt = Bolt.get(id);
    assert(bolt, NotFound, `cannot find Bolt with id ${id}`);

    debug(`Getting ${bolt.id} values`);
    async.series([
      (done) => { bolt.getRGBA(done); },
      (done) => { bolt.getHSB(done); },
      (done) => { bolt.getState(done); }
    ], (error, values) => {
      debug(`Got ${bolt.id} values: ${values}`);
      if (error) {
        errorHandler(error, response);
      } else {
        response.send({
          id: bolt.id,
          red: values[0][0],
          green: values[0][1],
          blue: values[0][2],
          alpha: values[0][3],
          hue: values[1][0],
          saturation: values[1][1],
          brightness: values[1][2],
          state: values[2]
        });
      }
    });
  } catch (error) {
    errorHandler(error, response);
  }
});

app.patch(`/:id`, (request, response) => {
  var tasks = [];

  try {
    const id = request.params.id,
          bolt = Bolt.get(id);

    debug(`Setting ${id} values`);
    assert(bolt, NotFound, `cannot find Bolt with id ${id}`);

    [
      'red',
      'green',
      'blue',
      'alpha',
      'hue',
      'saturation',
      'brightness',
      'state'
    ].forEach((property) => {
      const value = request.body[property];
      if (value !== undefined) {
        ((value) => {
          tasks.push((done) => {
            const method = `set${ucfirst(property)}`;
            debug(`${id}#${method} called with "${value}"`);
            bolt[method](value, done);
          });
        })(value);
      }
    });
    assert(tasks.length > 0, BadRequest, `no relevant data sent`);

    async.parallel(tasks, function(error) {
      if (error) {
        assert(error, BadRequest, error.message);
      }
      response.status(204).end();
    });
  } catch (err) {
    errorHandler(err, response, BadRequest);
  }
});

Bolt.init();
