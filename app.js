require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const auth = require('./src/controllers/auth.controller');
const verifySignUp = require('./src/middlewares/verifySignUp');

const userRoutes = require('./src/routes/user.routes');
const roleRoutes = require('./src/routes/role.routes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the application.' }));

app.post(
  '/signup',
  [
    verifySignUp.checkRequestData,
    verifySignUp.checkDuplicateUsername,
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkRolesExisted,
    verifySignUp.checkEmail,
    verifySignUp.checkPassword
  ],
  auth.signUp
);

app.post('/signin', auth.signIn);

app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

module.exports = app;
