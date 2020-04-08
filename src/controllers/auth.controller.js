const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randToken = require('rand-token');

const transport = require('../config/smtp.config');

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

  forgetPassword: async (req, res, next) => {
    try {
      const users = await User.findBy('email', req.body.email);

      if (users.length === 0) {
        throw new GeneralError(BAD_REQUEST, 'No account corresponds to this email address');
      }

      const resetPasswordToken = randToken.uid(250);
      const expirationDate = new Date(new Date().setMinutes(new Date().getMinutes() + 30));

      await User.update(
        users[0].id, 
        {
          reset_password_token: resetPasswordToken,
          reset_password_token_expiration_at: expirationDate
        }
      );

      if (!process.env.CLIENT_PATH) {
        const link = `${process.env.CLIENT_PATH}/reset-password?token=${resetPasswordToken}`;

        const emailContent = `
          <h1>SWATApp</h1>
          <p>Click <a href="${link}">here</a> to reset your password</p>
        `;

        await transport.sendMail({
          to: users[0].email,
          subject: '[SWATApp] Forget password',
          html: emailContent
        });

        return res.status(200).json({ message: `Email sent to ${users[0].email}` });
      }

      return res.status(200).json({ resetPasswordToken });
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const users = await User.findBy('reset_password_token', req.body.resetPasswordToken);

      if (users.length === 0) {
        throw new GeneralError(BAD_REQUEST, 'No account corresponds to this token');
      }

      if (new Date() > users[0].reset_password_token_expiration_at) {
        throw new GeneralError(BAD_REQUEST, 'This token is no longer valid');
      }

      await User.update(
        users[0].id, 
        {
          password: bcrypt.hashSync(req.body.password, 8),
          reset_password_token: null,
          reset_password_token_expiration_at: null
        }
      );

      return res.status(200).json({ message: 'Password has reinitialized' });
    } catch (error) {
      next(new ErrorHandler(error.statusCode, error));
    }
  },

  refreshAuth: async (req, res, next) => {
    try {
      const email = req.body.email;
      const refreshToken = req.body.refreshToken;

      if (!((refreshToken in global.refreshTokens) && (global.refreshTokens[refreshToken] === email))) {
        throw new GeneralError(UNAUTHORIZED);
      }

      const users = await User.findBy('email', email);
      delete users[0].password;
      
      /* TTL: 24 hours */
      const token = jwt.sign({ ...users[0] }, process.env.JWT_SECRET, { expiresIn: 86400 });

      return res.status(200).json({ token, refreshToken });
    } catch (error) {
      next(new ErrorHandler(500, error));
    }
  },

  rejectRefreshToken: (req, res, next) => {
    try {
      if(req.body.refreshToken in global.refreshTokens) { 
        delete global.refreshTokens[req.body.refreshToken];
      }
      return res.status(200).json({});
    } catch (error) {
      next(new ErrorHandler(500, new GeneralError(INTERNAL, error.message)));
    }
  }
};
