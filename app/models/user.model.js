const db = require('../config/db.config').promise();

const Profile = require('./profile.model');

module.exports = {
  create: async newUser => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      
      // Create the user
      const createUserQuery = connection.format(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?);',
        [newUser.username, newUser.email, newUser.password]
      );
      const [result] = await connection.query(createUserQuery);

      // Find the list of requested roles
      const findRolesQuery = connection.format(
        'SELECT * FROM roles WHERE name IN (?);',
        [newUser.roles]
      );
      const [roles] = await connection.query(findRolesQuery);

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
      const users = await module.exports.findById(result.insertId);

      return users[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.release();
    }
  },

  findById: async id => {
    const connection = await db.getConnection();

    try {
      const query = connection.format(
        `SELECT users.*, group_concat(roles.name) AS roles
        FROM users_roles
        JOIN users ON users.id = users_roles.user_id
        JOIN roles ON roles.id = users_roles.role_id
        WHERE users.id = ?
        GROUP BY users.id;`,
        [id]
      );
      const [users] = await connection.query(query);

      if (users.length !== 0) {
        // Format roles in array for each users
        users.forEach(user => user.roles = user.roles.split(','));
      }

      return users;
    } catch (error) {
      throw error;
    }
  },

  findByUsername: async username => {
    const connection = await db.getConnection();

    try {
      const query = connection.format(
        `SELECT users.*, group_concat(roles.name) AS roles
        FROM users_roles
        JOIN users ON users.id = users_roles.user_id
        JOIN roles ON roles.id = users_roles.role_id
        WHERE users.username = ?
        GROUP BY users.id;`,
        [username]
      );
      const [users] = await connection.query(query);

      if (users.length !== 0) {
        // Format roles in array for each users
        users.forEach(user => user.roles = user.roles.split(','));
      }

      return users;
    } catch (error) {
      throw error;
    }
  },

  findByEmail: async email => {
    const connection = await db.getConnection();

    try {
      const query = connection.format(
        `SELECT users.*, group_concat(roles.name) AS roles
        FROM users_roles
        JOIN users ON users.id = users_roles.user_id
        JOIN roles ON roles.id = users_roles.role_id
        WHERE users.email = ?
        GROUP BY users.id;`,
        [email]
      );
      const [users] = await connection.query(query);

      if (users.length !== 0) {
        // Format roles in array for each users
        users.forEach(user => user.roles = user.roles.split(','));
      }

      return users;
    } catch (error) {
      throw error;
    }
  }
};
