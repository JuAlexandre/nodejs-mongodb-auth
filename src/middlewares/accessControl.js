const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
      return res.status(403).json({ message: 'No token provided!' });
    }

    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Unauthorized!' });
      }
      req.userId = decoded.id;
      next();
    });
  },

  isAdmin: async (req, res, next) => {
    try {
      const users = await User.findById(req.userId);

      if (users.length === 0) {
        return res.status(404).json({ message: 'No user found...' });
      }

      if (!users[0].roles.includes('administrator')) {
        return res.status(401).json({ message: 'Require Administrator permission!' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  
  isModerator: async (req, res, next) => {
    try {
      const users = await User.findById(req.userId);

      if (users.length === 0) {
        return res.status(404).json({ message: 'No user found...' });
      }

      if (!users[0].roles.includes('moderator')) {
        return res.status(401).json({ message: 'Require Moderator permission!' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
