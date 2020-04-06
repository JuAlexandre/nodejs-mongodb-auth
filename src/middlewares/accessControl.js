const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const { FORBIDDEN, UNAUTHORIZED } = require('../errors/Errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      let token = req.headers['authorization'];

      if (!token) {
        throw new GeneralError(FORBIDDEN, 'No token provided!');
      }

      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }

      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          throw new GeneralError(UNAUTHORIZED);
        }
        req.userId = decoded.id;
        next();
      });
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  },

  isAdmin: async (req, res, next) => {
    try {
      const users = await User.findById(req.userId);

      if (users.length === 0) {
        throw new GeneralError(BAD_REQUEST, 'No account find');
      }

      if (!users[0].roles.includes('administrator')) {
        throw new GeneralError(UNAUTHORIZED, 'Require Administrator permission');
      }

      next();
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  },
  
  isModerator: async (req, res, next) => {
    try {
      const users = await User.findById(req.userId);

      if (users.length === 0) {
        throw new GeneralError(BAD_REQUEST, 'No account find');
      }

      if (!users[0].roles.includes('moderator')) {
        throw new GeneralError(UNAUTHORIZED, 'Require Moderator permission');
      }

      next();
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  }
};
