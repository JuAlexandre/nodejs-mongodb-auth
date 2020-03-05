const Role = require('../models/role.model');

module.exports = {
  findAll: async (req, res) => {
    try {
      const roles = await Role.findAll();
      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
