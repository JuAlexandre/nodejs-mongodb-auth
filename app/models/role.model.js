const db = require('../config/db.config').promise();

module.exports = {
  findAll: async () => {
    const connection = await db.getConnection();

    try {
      const sql = 'SELECT * FROM roles;';
      const [roles] = await connection.query(sql);
      return roles;
    } catch (error) {
      throw error;
    }
  }
};
