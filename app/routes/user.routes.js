const express = require('express');

const user = require('../controllers/user.controller');

const router = express.Router();

router.post('/', user.create);
router.get('/:id', user.findById);

module.exports = router;
