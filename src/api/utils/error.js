class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  get code() {
    if (this instanceof BadRequest) {
      return 400;
    }
    if (this instanceof NotFound) {
      return 404;
    }
    return 500;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "No JWT supplied or JWT is invalid") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}

module.exports = { GeneralError, BadRequest, NotFound, UnauthorizedError };
