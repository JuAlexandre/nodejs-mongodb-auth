const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randToken = require('rand-token');

const { registrationTokenExpirationDelay } = require ('../config/signUp.config');
const mailer = require ('../config/transport.config');

const User = require('../models/user.model');
const capitalizeFirstLetter = require('../services/capitalizeFirstLetter');
const validateEmail = require('../services/validateEmail');

module.exports = {
  signUp: async (req, res) => {
    const newUser = {
      username: capitalizeFirstLetter(req.body.username),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      roles:req.body.roles,
      registered_at: new Date(),
      registration_token: randToken.uid(255),
      registration_token_expiration_at: new Date(new Date().setMinutes(new Date().getMinutes() + registrationTokenExpirationDelay)),
    };

    try {
      const user = await User.create(newUser);

      const activeAccountLink = `${process.env.HOST}:${process.env.PORT}/active-account?token=${user.registration_token}`;
      const content = `<h2>Yggdrasil App</h2><p>Click <a href="${activeAccountLink}">here</a> to active your account:</p>`;

      await mailer.sendMail({
        to: user.email,
        subject: 'Confirm your account ⏳', 
        html: content
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  activeAccount: async (req, res) => {
    const users = await User.findBy('registration_token', req.query.token);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No user found...' });
    }

    if (new Date() > users[0].registration_token_expiration_at) {
      return res.status(404).json({ message: 'The link is no longer valid...' });
    }

    await User.update(
      users[0].id,
      { registration_token: null, registration_token_expiration_at: null }
    );

    return res.status(200).json({ message: 'Your account is activated!' });
  },

  signIn: async (req, res) => {
    try {
      const users = await User.findBy(
        validateEmail(req.body.login) ? 'email' : 'username',
        req.body.login
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'No user found...' });
      }

      if (!bcrypt.compareSync(req.body.password, users[0].password)) {
        return res.status(401).json({ message: 'Invalid Password!' });
      }

      // Remove password key from user object
      delete users[0].password;

      /* TTL: 24 hours */
      const token = jwt.sign({ ...users[0] }, process.env.JWT_SECRET, { expiresIn: 86400 });
      
      const refreshToken = randToken.uid(256);
      global.refreshTokens[refreshToken] = users[0].email;

      return res.status(200).json({ token, refreshToken });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  refreshAuth: async (req, res) => {
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
      return res.status(500).json({ message: error.message });
    }
  },

  rejectRefreshToken: (req, res) => {
    if(req.body.refreshToken in global.refreshTokens) { 
      delete global.refreshTokens[req.body.refreshToken];
    }
    res.send(204);
  }
};
