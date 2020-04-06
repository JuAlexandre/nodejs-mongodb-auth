/**
 * Error Handler
 * @param {number} statusCode - Error HTTP code
 * @param {Object[]} errors - Errors list
 */
class ErrorHandler extends Error {
  constructor(statusCode, errors) {
    super();
    this.statusCode = statusCode;
    this.errors = errors;
  }
};

module.exports = ErrorHandler;
