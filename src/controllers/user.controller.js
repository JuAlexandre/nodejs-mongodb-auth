const User = require('../models/user.model');

module.exports = {
  findById: async (req, res) => {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ message: 'The supplied parameter is not a number...' });
    }

    try {
      const users = await User.findBy('id', req.params.id);

      if (users.length === 0) {
        return res.status(404).json({ message: 'No user found...' });
      }

      return res.status(200).json(users[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
