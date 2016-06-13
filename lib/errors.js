"use strict";

class NotFound {
  constructor(message) {
    this.status = 404;
    this.message = message;
  }
}

class BadRequest {
  constructor(message) {
    this.status = 400;
    this.message = message;
  }
}

class ServerError {
  constructor(message) {
    this.status = 500;
    this.message = message;
  }
}

module.exports.NotFound = NotFound;
module.exports.BadRequest = BadRequest;
module.exports.ServerError = ServerError;
