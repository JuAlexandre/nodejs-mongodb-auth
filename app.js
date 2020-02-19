require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./app/routes/user.routes');
const roleRoutes = require('./app/routes/role.routes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the application.' }));

app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

module.exports = app;
