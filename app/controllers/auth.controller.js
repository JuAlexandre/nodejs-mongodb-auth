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
  }
};
