# nodejs-mysql-auth

Training project for the implementation of an authentication system with NodeJS, MySQL, Express and JSONWebToken.

## Installation

Load this SQL script to set up the database:

```sql
DROP DATABASE IF EXISTS `nodejs-mysql-auth`;
CREATE DATABASE `nodejs-mysql-auth`;
USE `nodejs-mysql-auth`;

CREATE TABLE users (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE profiles (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
  user_id INT NOT NULL,
  avatar VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100)
) ENGINE = InnoDB;

CREATE TABLE users_roles (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    role_id INT NOT NULL
) ENGINE = InnoDB;

CREATE TABLE roles (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE
) ENGINE = InnoDB;

ALTER TABLE users_roles
	ADD CONSTRAINT fk_users_roles__user_id
		FOREIGN KEY (user_id)
		REFERENCES users(id),
	ADD CONSTRAINT fk_users_roles__role_id
		FOREIGN KEY (role_id)
		REFERENCES roles(id);
        
ALTER TABLE profiles
	ADD CONSTRAINT fk_profiles_user_id
		FOREIGN KEY (user_id)
        REFERENCES users(id);

INSERT INTO roles(name) VALUES ('administrator');
INSERT INTO roles(name) VALUES ('moderator');
INSERT INTO roles(name) VALUES ('user');
```

```
git clone https://github.com/JuAlexandre/nodejs-mysql-auth.git
cd nodejs-mysql-auth
yarn install
```

Copy and rename the `.env.template` file to `.env` and modify the database informations.

Launch the server:

```
yarn start
```

## Documentation

Comming soon...
