const { BAD_REQUEST, REQUIRED, INVALID } = require('../config/errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');
const FormFieldError = require('../errors/FormFieldError');

const validateEmail = require('../services/validateEmail');

module.exports = {
  checkMissingFields: (req, res, next) => {
    try {
      if (!Object.keys(req.body).includes('email')) {
        throw new GeneralError(BAD_REQUEST, 'Email field\'s missing in the request body');
      }

      if (!Object.keys(req.body).includes('password')) {
        throw new GeneralError(BAD_REQUEST, 'Password field\'s missing in the request body');
      }

      next();
    } catch (error) {
      next(new ErrorHandler(400, error));
    }
  },

  checkEmptyFields: (req, res, next) => {
    try {
      if (req.body.email.length === 0) {
        throw new FormFieldError(REQUIRED, 'email');
      }

      if (req.body.password.length === 0) {
        throw new FormFieldError(REQUIRED, 'password');
      }

      next();
    } catch (error) {
      next(new ErrorHandler(400, error));
    }
  },

  checkEmail: (req, res, next) => {
    try {
      const email = req.body.email;
      if (!validateEmail(email)) {
        throw new FormFieldError(INVALID, 'email', 'Email address format isn\'t valid');
      }
      next();
    } catch (error) {
      next(new ErrorHandler(400, error));
    }
  }
};
