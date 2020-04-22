const jwt = require('jsonwebtoken');

const { User, Role } = require('../config/db.config');

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
        req.userId = decoded._id;
        next();
      });
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  },

  isAdmin: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      const role = await Role.findOneBy({ name: 'administrator' });

      if (!user) {
        throw new GeneralError(BAD_REQUEST, 'No account find');
      }

      if (!user.roles.includes(role._id)) {
        throw new GeneralError(UNAUTHORIZED, 'Require Administrator permission');
      }

      next();
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  },
  
  isModerator: async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      const role = await Role.findOneBy({ name: 'moderator' });

      if (!user) {
        throw new GeneralError(BAD_REQUEST, 'No account find');
      }

      if (!user.roles.includes(role._id)) {
        throw new GeneralError(UNAUTHORIZED, 'Require Moderator permission');
      }

      next();
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  }
};
