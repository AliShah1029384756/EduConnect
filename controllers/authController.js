const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { store, nextId } = require('../data/store');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio || '',
    imageUrl: user.imageUrl || ''
  };
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

async function signUp(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existingUser = store.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nextId('u'),
    name,
    email,
    role: 'user',
    passwordHash,
    bio: '',
    imageUrl: ''
  };
  store.users.push(user);

  const token = signToken(user);
  const expiresIn = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  return res.status(201).json({
    token,
    expiresIn,
    user: sanitizeUser(user)
  });
}

async function signIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = store.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user);
  const expiresIn = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  return res.json({
    token,
    expiresIn,
    user: sanitizeUser(user)
  });
}

function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const request = {
    id: nextId('reset'),
    email,
    createdAt: new Date().toISOString()
  };

  store.passwordResetRequests.push(request);

  return res.json({
    message: 'If this email exists, a reset link has been queued.',
    requestId: request.id
  });
}

async function resetPassword(req, res) {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and newPassword are required' });
  }

  const user = store.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  return res.json({ message: 'Password reset successfully' });
}

module.exports = {
  signIn,
  signUp,
  forgotPassword,
  resetPassword
};
