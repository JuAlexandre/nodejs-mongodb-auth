const mongoose = require('mongoose');

const User = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  registeredAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String, default: null },
  resetPasswordTokenExpirationAt: { type: Date, default: null },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }]
});

module.exports = mongoose.model('User', User);
