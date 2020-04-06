/**
 * General Error
 * @param {Object} error - Type of error
 * @param {number} error.statusCode - The error status code
 * @param {number} error.code - The error code
 * @param {string} error.type - The error type
 * @param {string} error.placement - The type of error displayed on the client app
 * @param {string} error.message - The explicit description of error
 * @param {string} message - Custom message for the error
 */
class GeneralError {
  constructor(error, message) {
    this.statusCode = error.statusCode;
    this.code = error.code;
    this.type = error.type;
    this.placement = error.placement;
    this.message = message ? message : error.message;
  }
};

module.exports = GeneralError;
