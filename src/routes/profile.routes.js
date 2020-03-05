const express = require('express');

const profil = require('../controllers/profile.controller');

const router = express.Router({ mergeParams: true });

router.get('/profiles', profil.findByUserId);

module.exports = router;
