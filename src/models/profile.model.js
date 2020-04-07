const db = require('../config/db.config').promise();

module.exports = {
  create: async userId => {
    const connection = await db.getConnection();

    try {
      const query = connection.format(
        'INSERT INTO profiles (user_id) VALUES (?);',
        [userId]
      );
      const [result] = await connection.query(query);

      // Find the profil previously created
      const profiles = await module.exports.findBy('id', result.insertId);

      return profiles[0];
    } catch (error) {
      throw error;
    } finally {
      await connection.release();
    }
  },

  findBy: async (field, value) => {
    const connection = await db.getConnection();

    try {
      const query = connection.format(
        'SELECT * FROM profiles WHERE ?? = ? GROUP BY id;',
        [field, value]
      );
      const [profiles] = await connection.query(query);
      return profiles;
    } catch (error) {
      throw error;
    } finally {
      await connection.release();
    }
  }
};
