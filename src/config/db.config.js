const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.User = require('../models/user.model');
db.Role = require('../models/role.model');
db.Profile = require('../models/profile.model');

db.ROLES = ['administrator', 'moderator', 'user'];

db.mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    initial();
  })
  .catch(error => {
    console.error('MongoDB connection error', error);
    process.exit();
  });

function initial() {
  db.Role.estimatedDocumentCount((error, count) => {
    if (!error && count === 0) {
      db.ROLES.forEach(role => new db.Role({ name: role }).save());
    }
  });
}

module.exports = db;
