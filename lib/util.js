"use strict";

const ucfirst = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const assert = (condition, _class, message) => {
  if (!condition) {
    throw new _class(message);
  }
};

const errorHandler = (err, res) => {
  res.status(err.status).send({
    error: err.message
  });
};

const responseHandler = (res, name, value) => {
  var body = {};
  body[name] = value;
  res.send(body);
};

module.exports = {ucfirst, assert, errorHandler, responseHandler};
