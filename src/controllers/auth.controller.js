const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randToken = require('rand-token');

const User = require('../models/user.model');
const capitalizeFirstLetter = require('../services/capitalizeFirstLetter');
const validateEmail = require('../services/validateEmail');

module.exports = {
  signUp: async (req, res) => {
    const newUser = {
      username: capitalizeFirstLetter(req.body.username),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      isConnected: false,
      registeredAt: new Date(),
      lastConnectionAt: null,
      roles:req.body.roles
    };

    try {
      const user = await User.create(newUser);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  signIn: async (req, res) => {
    try {
      let users = [];

      if (validateEmail(req.body.login)) {
        users = await User.findByEmail(req.body.login);
      } else {
        users = await User.findByUsername(req.body.login);
      }

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
        const users = await User.findByEmail(email);
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
