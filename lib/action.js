'use strict';

const debug = require('debug')(require('../package').name);

module.exports = (bolt, name, set) => {
  const method = (set ? 'set' : 'get') + name.charAt(0).toUpperCase() + name.slice(1);
  debug(`${method} added`);
  return (req, res) => {
    debug(`${method} called`);
    const args = set ? [
      req.body ? req.body[name] : undefined,
      (err) => {
        res.end();
      }
    ] : [
      (err, value) => {
        debug(`${method} returned value: ${value}`);
        var body = {};
        body[name] = value;
        res.send(body);
      }
    ];
    debug(`${method} args: ${args}`);
    bolt.connect(() => {
      bolt[method].apply(bolt, args);
    });
  };
};
