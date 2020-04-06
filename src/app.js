require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');

global.refreshTokens = {};

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the application.' }));

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

app.use(({ statusCode, error }, req, res, next) => res.status(statusCode).json(error));

module.exports = app;
