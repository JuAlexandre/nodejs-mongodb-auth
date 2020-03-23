const express = require('express');

const verifySignUp = require('../middlewares/verifySignUp');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router.post(
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

router.post('/signin', auth.signIn);

router.post('/refresh-auth', auth.refreshAuth);

router.post('/reject-refresh-token', auth.rejectRefreshToken);

module.exports = router;
