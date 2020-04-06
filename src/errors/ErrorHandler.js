/**
 * Error Handler
 * @param {number} statusCode - Error HTTP code
 * @param {Object} error - Error
 */
class ErrorHandler extends Error {
  constructor(statusCode, error) {
    super();
    this.statusCode = statusCode;
    this.error = error;
  }
};

module.exports = ErrorHandler;
