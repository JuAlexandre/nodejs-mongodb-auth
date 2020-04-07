const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randToken = require('rand-token');

const { BAD_REQUEST, INTERNAL, UNAUTHORIZED } = require('../errors/Errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');

const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const capitalizeFirstLetter = require('../services/capitalizeFirstLetter');

module.exports = {
  signUp: async (req, res, next) => {
    const newUser = {
      username: capitalizeFirstLetter(req.body.username),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      roles:req.body.roles,
      registered_at: new Date(),
    };

    try {
      const user = await User.create(newUser);
      return res.status(201).json(user);
    } catch (error) {
      next(new ErrorHandler(500, new GeneralError(INTERNAL, error.message)));
    }
  },

  signIn: async (req, res, next) => {
    try {
      const users = await User.findBy('email', req.body.email);

      if (users.length === 0) {
        throw new GeneralError(BAD_REQUEST, 'No account corresponds to this email address');
      }

      if (!bcrypt.compareSync(req.body.password, users[0].password)) {
        throw new GeneralError(UNAUTHORIZED, 'Email address or password invalid');
      }

      const profiles = await Profile.findBy('user_id', users[0].id);

      if (profiles.length === 0) {
        throw new GeneralError(BAD_REQUEST, 'No profile corresponds to this email address');
      }

      // Remove keys from user object
      delete users[0].password;
      delete users[0].reset_password_token;
      delete users[0].reset_password_token_expiration_at;

      /* TTL: 24 hours */
      const token = jwt.sign({ ...users[0], profile: profiles[0] }, process.env.JWT_SECRET, { expiresIn: 86400 });
      
      const refreshToken = randToken.uid(256);
      global.refreshTokens[refreshToken] = users[0].email;

      return res.status(200).json({ token, refreshToken });
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  },

  refreshAuth: async (req, res, next) => {
    try {
      const email = req.body.email;
      const refreshToken = req.body.refreshToken;

      if ((refreshToken in global.refreshTokens) && (global.refreshTokens[refreshToken] === email)) {
        const users = await User.findBy('email', email);
        delete users[0].password;
        
        /* TTL: 24 hours */
        const token = jwt.sign({ ...users[0] }, process.env.JWT_SECRET, { expiresIn: 86400 });

        return res.status(200).json({ token, refreshToken });
      } else {
        return res.status(401);
      }
    } catch (error) {
      next(new ErrorHandler(500, new GeneralError(INTERNAL, error.message)));
    }
  },

  rejectRefreshToken: (req, res, next) => {
    try {
      if(req.body.refreshToken in global.refreshTokens) { 
        delete global.refreshTokens[req.body.refreshToken];
      }
      res.send(200);
    } catch (error) {
      next(new ErrorHandler(500, new GeneralError(INTERNAL, error.message)));
    }
  }
};
