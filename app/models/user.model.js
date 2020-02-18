const db = require('../config/db.config').promise();

module.exports = {
  create: async newUser => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      
      // Create the user
      const createUserQuery = connection.format(
        'INSERT INTO users (email, password) VALUES (?, ?);',
        [newUser.email, newUser.password]
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

      // Find the user previously created with their roles
      const findCreatedUserQuery = connection.format(
        `SELECT users.*, group_concat(roles.name) AS roles
        FROM users_roles
        JOIN users ON users.id = users_roles.user_id
        JOIN roles ON roles.id = users_roles.role_id
        WHERE users.id = ?;`,
        [result.insertId]
      );
      const [users] = await connection.query(findCreatedUserQuery);

      // Format roles in array
      const user = users[0];
      user.roles = user.roles.split(',');

      await connection.commit();

      return user;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.release();
    }
  }
};
