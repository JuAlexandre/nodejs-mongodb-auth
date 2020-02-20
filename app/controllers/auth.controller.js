const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

module.exports = {
  signUp: async (req, res) => {
    const newUser = {
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
      const users = await User.findByEmail(req.body.email);

      if (users.length === 0) {
        return res.status(404).json({ message: 'No user found...' });
      }

      if (!bcrypt.compareSync(req.body.password, users[0].password)) {
        return res.status(401).json({ message: 'Invalid Password!' });
      }

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
