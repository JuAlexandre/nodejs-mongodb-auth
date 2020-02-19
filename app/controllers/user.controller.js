const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

module.exports = {
  create: async (req, res) => {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No content provided...' });
    }

    if (!Object.keys(req.body).includes('email')) {
      return res.status(400).json({ message: 'The email field is missing...' });
    }

    if (!Object.keys(req.body).includes('password')) {
      return res.status(400).json({ message: 'The password field is missing...' });
    }

    if (req.body.email.length === 0) {
      return res.status(400).json({ message: 'The email field cannot be null...' });
    }

    if (req.body.password.length === 0) {
      return res.status(400).json({ message: 'The password field cannot be null...' });
    }

    const newUser = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      roles: Object.keys(req.body).includes('roles') ? req.body.roles : ['user'],
    };
  
    try {
      const user = await User.create(newUser);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  findById: async (req, res) => {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ message: 'The supplied parameter is not a number...' });
    }

    try {
      const user = await User.findById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      if (error.message === 'not_found') {
        return res.status(404).json({ message: 'No user found...' });
      }
      return res.status(500).json({ message: error.message });
    }
  }
};
