const db = require('../config/db.config').promise();

const Profile = require('./profile.model');

module.exports = {
  create: async user => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Find the list of requested roles
      const findRolesQuery = connection.format(
        'SELECT * FROM roles WHERE name IN (?);',
        [user.roles]
      );
      const [roles] = await connection.query(findRolesQuery);

      // Remove roles key from user object
      delete user.roles;
      
      // Create the user
      const createUserQuery = connection.format(
        'INSERT INTO users SET ?;',
        [user]
      );
      const [result] = await connection.query(createUserQuery);

      // Create the roles associated with the previously created user
      const userRolesIds = roles.map(role => [result.insertId, role.id]);
      const createUserRolesQuery = connection.format(
        'INSERT INTO users_roles (user_id, role_id) VALUES ?;',
        [userRolesIds]
      );
      await connection.query(createUserRolesQuery);

      await connection.commit();

      // Create the user profil
      await Profile.create(result.insertId);

      // Find the user previously created with their roles
      const users = await module.exports.findBy('id', result.insertId);

      return users[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.release();
    }
  },

  findBy: async (field, value) => {
    const connection = await db.getConnection();

    try {
      const query = connection.format(
        `SELECT users.*, group_concat(roles.name) AS roles
        FROM users_roles
        JOIN users ON users.id = users_roles.user_id
        JOIN roles ON roles.id = users_roles.role_id
        WHERE users.?? = ?
        GROUP BY users.id;`,
        [field, value]
      );
      const [users] = await connection.query(query);

      if (users.length !== 0) {
        // Format roles in array for each users
        users.forEach(user => user.roles = user.roles.split(','));
      }

      return users;
    } catch (error) {
      throw error;
    } finally {
      await connection.release();
    }
  },

  update: async (id, data) => {
    const connection = await db.getConnection();

    try {
      const query = connection.format(
        `UPDATE users SET ? WHERE id = ?`,
        [data, id]
      );
      const [result] = await connection.query(query);

      console.log('result', result);

      // Find the user previously created with their roles
      const users = await module.exports.findBy('id', id);

      return users[0];
    } catch (error) {
      throw error;
    } finally {
      await connection.release();
    }
  }
};
