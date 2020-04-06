const User = require('../models/user.model');
const Role = require('../models/role.model');

const { BAD_REQUEST, REQUIRED, INVALID, UNPROCESSABLE } = require('../config/errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');
const FormFieldError = require('../errors/FormFieldError');

const validateEmail = require('../services/validateEmail');
const validatePassword = require('../services/validatePassword');

module.exports = {
  checkMissingFields: (req, res, next) => {
    try {
      if (!Object.keys(req.body).includes('username')) {
        throw new GeneralError(BAD_REQUEST, 'Username field\'s missing in the request body');
      }

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
      if (req.body.username.length === 0) {
        throw new FormFieldError(REQUIRED, 'username');
      }

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
  },

  checkPassword: async (req, res, next) => {
    try {
      const password = req.body.password;
      if (!validatePassword(password)) {
        throw new FormFieldError(INVALID, 'password', 'Password format isn\'t valid');
      }
      next();
    } catch (error) {
      next(new ErrorHandler(400, error));
    }
  },

  checkDuplicateUsername: async (req, res, next) => {
    try {
      const users = await User.findBy('username', req.body.username);
      if (users.length !== 0) {
        throw new FormFieldError(UNPROCESSABLE, 'username', 'Username already exists');
      }
      next();
    } catch (error) {
      next(new ErrorHandler(400, error));
    }
  },

  checkDuplicateEmail: async (req, res, next) => {
    try {
      const users = await User.findBy('email', req.body.email);
      if (users.length !== 0) {
        throw new FormFieldError(UNPROCESSABLE, 'email', 'Email address already exists');
      }
      next();
    } catch (error) {
      next(new ErrorHandler(400, error));
    }
  },

  checkRolesExisted: async (req, res, next) => {
    try {
      if (!Object.keys(req.body).includes('roles') || req.body.roles.length === 0) {
        req.body.roles = ['user'];
      }

      let roles = await Role.findAll();

      // Keep only names
      roles = roles.map(role => role.name);

      req.body.roles.forEach(role => {
        if (!roles.includes(role)) {
          new GeneralError(BAD_REQUEST, `'${role}' role doesn't exist`);
        }
      });

      next();
    } catch (error) {
      next(new ErrorHandler(400, error));
    }
  }
};
