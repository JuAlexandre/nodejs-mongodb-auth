const express = require('express');

const role = require('../controllers/role.controller');

const router = express.Router();

router.get('/', role.findAll);

module.exports = router;
