const express = require('express');

const verifySignUp = require('../middlewares/verifySignUp');
const verifySignIn = require('../middlewares/verifySignIn');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/sign-up',
  [
    verifySignUp.checkMissingFields,
    verifySignUp.checkEmptyFields,
    verifySignUp.checkEmail,
    verifySignUp.checkPassword,
    verifySignUp.checkDuplicateUsername,
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkRolesExisted
  ],
  auth.signUp
);

router.post(
  '/sign-in',
  [
    verifySignIn.checkMissingFields,
    verifySignIn.checkEmptyFields,
    verifySignIn.checkEmail,
  ],
  auth.signIn
);

router.post('/refresh-auth', auth.refreshAuth);

router.post('/reject-refresh-token', auth.rejectRefreshToken);

module.exports = router;
