const User = require('../models/user.model');
const Role = require('../models/role.model');

const validateEmail = require('../services/validateEmail');
const validatePassword = require('../services/validatePassword');

module.exports = {
  checkRequestBody: (req, res, next) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No content provided...' });
    }

    if (!Object.keys(req.body).includes('username')) {
      return res.status(400).json({ message: 'The username field is missing...' });
    }

    if (!Object.keys(req.body).includes('email')) {
      return res.status(400).json({ message: 'The email field is missing...' });
    }

    if (!Object.keys(req.body).includes('password')) {
      return res.status(400).json({ message: 'The password field is missing...' });
    }

    if (req.body.username.length === 0) {
      return res.status(400).json({ message: 'The username field cannot be null...' });
    }

    if (req.body.email.length === 0) {
      return res.status(400).json({ message: 'The email field cannot be null...' });
    }

    if (req.body.password.length === 0) {
      return res.status(400).json({ message: 'The password field cannot be null...' });
    }

    if (!Object.keys(req.body).includes('roles') || req.body.roles.length === 0) {
      req.body.roles = ['user'];
    }

    next();
  },

  checkDuplicateUsername: async (req, res, next) => {
    try {
      const users = await User.findBy('username', req.body.username);

      if (users.length !== 0) {
        return res.status(400).json({ message: 'This username is already used!' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  checkDuplicateEmail: async (req, res, next) => {
    try {
      const users = await User.findBy('email', req.body.email);

      if (users.length !== 0) {
        return res.status(400).json({ message: 'This email is already used!' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  checkRolesExisted: async (req, res, next) => {
    try {
      let roles = await Role.findAll();

      // Keep only names
      roles = roles.map(role => role.name);

      req.body.roles.forEach(role => {
        if (!roles.includes(role)) {
          throw { type: 'not_exist', role };
        }
      });

      next();
    } catch (error) {
      if (error.type === 'not_exist') {
        return res.status(400).json({ message: `Failed! ${error.role} role does not exist...` });
      }
      return res.status(500).json({ message: error.message });
    }
  },

  checkPassword: async (req, res, next) => {
    try {
      const password = req.body.password;
      if (!validatePassword(password)) {
        const message = 'Password must contain at least 8 characters, one digit, one special character, one upper case character and one lower case character';
        return res.status(400).json({ message });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  checkEmail: async (req, res, next) => {
    try {
      const email = req.body.email;
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'This mail is not in the right format' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
