'use strict';

const action = require('./action'),
      actions = ['state', 'hue', 'saturation', 'brightness'];

module.exports = (app, bolt) => {
  actions.forEach((name) => {
    app.put(`/${bolt.id}/${name}`, action(bolt, name, true));
    app.get(`/${bolt.id}/${name}`, action(bolt, name, false));
  });
};
