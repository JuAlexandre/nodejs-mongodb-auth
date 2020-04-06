const Role = require('../models/role.model');

const { INTERNAL } = require('../errors/Errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');

module.exports = {
  findAll: async (req, res, next) => {
    try {
      const roles = await Role.findAll();
      return res.status(200).json(roles);
    } catch (error) {
      next(new ErrorHandler(500, new GeneralError(INTERNAL, error.message)));
    }
  }
};
