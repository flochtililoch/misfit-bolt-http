"use strict";

const debug = require('debug')(`${require('../package').name}#util`),
      ServerError = require('./errors').ServerError;

const ucfirst = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const assert = (condition, _class, message) => {
  if (!condition) {
    throw new _class(message);
  }
};

const errorHandler = (error, response, defaultErrorClass) => {
  if (!error.status) {
    defaultErrorClass = defaultErrorClass ? defaultErrorClass : ServerError;
    error = new defaultErrorClass(error.message);
  }
  debug(`sending error with status "${error.status}" and message "${error.message}"`);
  response.status(error.status).send({
    error: error.message
  });
};

module.exports = {ucfirst, assert, errorHandler};
