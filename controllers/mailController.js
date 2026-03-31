const asyncHandler = require('express-async-handler');

const sendConfirmationEmail = asyncHandler(async (_req, res) => {
  res.status(200).json({ message: 'Session confirmation email endpoint is active' });
});

const sendPasswordResetEmail = asyncHandler(async (_req, res) => {
  res.status(200).json({ message: 'Password reset email endpoint is active' });
});

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail
};
