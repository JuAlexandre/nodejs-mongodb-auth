const mongoose = require('mongoose');

const Profile = new mongoose.Schema({
  avatar: String,
  firstName: String,
  lastName: String
});

module.exports = mongoose.model('Profile', Profile);
