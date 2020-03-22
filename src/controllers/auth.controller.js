const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const capitalizeFirstLetter = require('../services/capitalizeFirstLetter');
const validateEmail = require('../services/validateEmail');

module.exports = {
  signUp: async (req, res) => {
    const newUser = {
      username: capitalizeFirstLetter(req.body.username),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
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

      const token = jwt.sign(
        { ...users[0] },
        process.env.SECRET,
        { expiresIn: 86400 /* 24 hours */ }
      );
  
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
