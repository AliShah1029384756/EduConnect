const express = require('express');
const router = express.Router();
const {
  signIn,
  signUp,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;