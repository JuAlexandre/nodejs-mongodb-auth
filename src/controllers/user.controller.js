const User = require('../models/user.model');

const { BAD_REQUEST, INTERNAL } = require('../config/errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');

module.exports = {
  findById: async (req, res, next) => {
    try {
      const users = await User.findBy('id', req.params.id);

      if (users.length === 0) {
        throw new GeneralError(BAD_REQUEST);
      }

      return res.status(200).json(users[0]);
    } catch (error) {
      next(new ErrorHandler(404, error));
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.update(req.params.id, req.body);

      return res.status(200).json(user);
    } catch (error) {
      next(new ErrorHandler(500, new GeneralError(INTERNAL, error.message)));
    }
  }
};
