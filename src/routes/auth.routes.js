const express = require('express');

const verifySignUp = require('../middlewares/verifySignUp');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/sign-up',
  [
    verifySignUp.checkRequestData,
    verifySignUp.checkEmail,
    verifySignUp.checkPassword,
    verifySignUp.checkDuplicateUsername,
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkRolesExisted
  ],
  auth.signUp
);

router.post('/sign-in', auth.signIn);

router.post('/refresh-auth', auth.refreshAuth);

router.post('/reject-refresh-token', auth.rejectRefreshToken);

module.exports = router;
