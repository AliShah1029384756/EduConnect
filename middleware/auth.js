const jwt = require('jsonwebtoken');
const { store } = require('../data/store');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = store.users.find((u) => u.id === payload.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid user session' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = {
  isAuthenticated,
  isAdmin
};
