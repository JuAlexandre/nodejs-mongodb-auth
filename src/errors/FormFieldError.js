const GeneralError = require('./GeneralError');

/**
 * FormFieldError Error
 * @param {Object} error - Type of error
 * @param {number} error.code - The error code
 * @param {string} error.type - The error type
 * @param {string} error.placement - The type of error displayed on the client app
 * @param {string} error.message - The explicit description of error
 * @param {string} field - The name of the field concerned in the client app
 * @param {string} message - Custom message for the error
 */
class FormFieldError extends GeneralError {
  constructor(error, field, message) {
    super(error, message);
    this.field = field;
  }
};

module.exports = FormFieldError;
