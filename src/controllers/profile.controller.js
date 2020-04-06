const Profile = require('../models/profile.model');

const { BAD_REQUEST } = require('../errors/Errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');

module.exports = {
  findByUserId: async (req, res, next) => {
    try {
      const profiles = await Profile.findByUserId(req.params.id);

      if (profiles.length === 0) {
        throw new GeneralError(BAD_REQUEST);
      }

      return res.status(200).json(profiles[0]);
    } catch (error) {
      next(new ErrorHandler(500, error));
    }
  }
};
