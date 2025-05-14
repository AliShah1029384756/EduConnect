const express = require('express');
const router = express.Router();
const {
  sendConfirmationEmail,
  sendPasswordResetEmail
} = require('../controllers/mailController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/confirm-session', isAuthenticated, sendConfirmationEmail);
router.post('/reset-password', sendPasswordResetEmail);

module.exports = router;