const express = require('express');
const router = express.Router();
const {
  signIn,
  signUp,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { authValidators, validateRequest } = require('../middleware/validators');

router.post('/signin', authValidators.signIn, validateRequest, signIn);
router.post('/signup', authValidators.signUp, validateRequest, signUp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;