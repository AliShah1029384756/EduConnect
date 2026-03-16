function sendConfirmationEmail(req, res) {
  return res.json({
    message: 'Session confirmation email queued',
    payload: req.body
  });
}

function sendPasswordResetEmail(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  return res.json({ message: 'Password reset email queued' });
}

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail
};
