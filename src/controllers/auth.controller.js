const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randToken = require('rand-token');

const { User, Role, Profile } = require('../config/db.config');
const transport = require('../config/smtp.config');

const { BAD_REQUEST, INTERNAL, UNAUTHORIZED } = require('../errors/Errors');

const ErrorHandler = require('../errors/ErrorHandler');
const GeneralError = require('../errors/GeneralError');

const capitalizeFirstLetter = require('../services/capitalizeFirstLetter');

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const roles = await Role.find({ name: { '$in' : req.body.roles } });

      const profile = await new Profile({
        avatar: null,
        firstName: null,
        lastName: null
      }).save();

      const newUser = new User({
        username: capitalizeFirstLetter(req.body.username),
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        profile,
        roles
      });

      const user = await newUser.save();
      delete user.password;
      return res.status(201).json(user);
    } catch (error) {
      next(new ErrorHandler(500, new GeneralError(INTERNAL, error.message)));
    }
  },

  signIn: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email }).populate('roles').populate('profile');

      if (!user) {
        throw new GeneralError(BAD_REQUEST, 'No account corresponds to this email address');
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        throw new GeneralError(UNAUTHORIZED, 'Email address or password invalid');
      }

      // Remove keys from user object
      delete user.password;

      /* TTL: 24 hours */
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: 86400 });
      
      const refreshToken = randToken.uid(256);
      global.refreshTokens[refreshToken] = user.email;

      return res.status(200).json({ token, refreshToken });
    } catch (error) {
      console.log(error)
      next(new ErrorHandler(error.statusCode, error));
    }
  },

  forgetPassword: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email }).populate('roles').populate('profile');

      if (!user) {
        throw new GeneralError(BAD_REQUEST, 'No account corresponds to this email address');
      }

      const resetPasswordToken = randToken.uid(250);
      const expirationDate = new Date(new Date().setMinutes(new Date().getMinutes() + 30));

      await User.findByIdAndUpdate(
        user._id, 
        {
          resetPasswordToken,
          resetPasswordTokenExpirationAt: expirationDate
        },
        { useFindAndModify: false }
      );

      if (process.env.CLIENT_PATH) {
        const link = `${process.env.CLIENT_PATH}/reset-password?token=${resetPasswordToken}`;

        const emailContent = `
          <h1>AppName</h1>
          <p>Click <a href="${link}">here</a> to reset your password</p>
        `;

        await transport.sendMail({
          to: user.email,
          subject: '[AppName] Forget password',
          html: emailContent
        });

        return res.status(200).json({ message: `Email sent to ${user.email}` });
      }

      return res.status(200).json({ resetPasswordToken });
    } catch (error) {
      console.log(error)
      next(new ErrorHandler(error.statusCode, error));
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const user = await User.findOne({ resetPasswordToken: req.body.resetPasswordToken });

      if (!user) {
        throw new GeneralError(BAD_REQUEST, 'No account corresponds to this token');
      }

      if (new Date() > user.resetPasswordTokenExpirationAt) {
        throw new GeneralError(BAD_REQUEST, 'This token is no longer valid');
      }

      await User.findByIdAndUpdate(
        user._id, 
        {
          password: bcrypt.hashSync(req.body.password, 8),
          resetPasswordToken: null,
          resetPasswordTokenExpirationAt: null
        },
        { useFindAndModify: false }
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

      const user = await User.findOneBy({ email });
      delete user.password;
      
      /* TTL: 24 hours */
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: 86400 });

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
