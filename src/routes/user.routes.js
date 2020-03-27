const express = require('express');

const user = require('../controllers/user.controller');
const profileRoutes = require('./profile.routes');

const router = express.Router();

router.use('/:id', profileRoutes);

router.get('/:id', user.findById);

router.put('/:id', user.update)

module.exports = router;
