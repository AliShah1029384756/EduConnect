const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, createId, publicUser } = require('../utils/store');

const resetTokens = new Map();

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );
}

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = db.users.find((u) => u.email === normalizedEmail);
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const safeRole = role === 'counselor' ? 'counselor' : 'student';
  const user = {
    _id: createId('u'),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(String(password), 10),
    role: safeRole,
    bio: '',
    imageUrl: ''
  };

  db.users.push(user);

  const token = signToken(user);
  const expiresIn = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  return res.status(201).json({
    message: 'Account created successfully',
    token,
    expiresIn,
    user: publicUser(user)
  });
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = db.users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user);
  const expiresIn = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  return res.status(200).json({
    message: 'Signed in successfully',
    token,
    expiresIn,
    user: publicUser(user)
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  const normalizedEmail = String(email || '').toLowerCase().trim();
  const user = db.users.find((u) => u.email === normalizedEmail);

  if (user) {
    const resetToken = createId('reset');
    resetTokens.set(resetToken, { userId: user._id, expiresAt: Date.now() + 30 * 60 * 1000 });
  }

  return res.status(200).json({ message: 'If the email exists, a reset link has been generated.' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'token and newPassword are required' });
  }

  const data = resetTokens.get(token);
  if (!data || data.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Reset token is invalid or expired' });
  }

  const user = db.users.find((u) => u._id === data.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.passwordHash = await bcrypt.hash(String(newPassword), 10);
  resetTokens.delete(token);
  return res.status(200).json({ message: 'Password reset successful' });
});

const checkToken = asyncHandler(async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const expiryMs = decoded.exp * 1000 - Date.now();
    return res.status(200).json({
      valid: true,
      expiresSoon: expiryMs < 5 * 60 * 1000,
      minutesLeft: Math.max(0, Math.floor(expiryMs / 60000))
    });
  } catch (_err) {
    return res.status(401).json({ valid: false, message: 'Token invalid or expired' });
  }
});

module.exports = {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  checkToken
};
