const Profile = require('../models/profile.model');

module.exports = {
  findByUserId: async (req, res) => {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ message: 'The supplied parameter is not a number...' });
    }

    try {
      const profiles = await Profile.findByUserId(req.params.id);

      if (profiles.length === 0) {
        return res.status(404).json({ message: 'No profile found...' });
      }

      return res.status(200).json(profiles[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
