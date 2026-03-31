const asyncHandler = require('express-async-handler');
const { db, publicUser } = require('../utils/store');

const validRoles = ['student', 'counselor', 'admin'];

const getDashboard = asyncHandler(async (_req, res) => {
  return res.status(200).json({
    usersCount: db.users.length,
    sessionsCount: db.sessions.length,
    postsCount: db.posts.length
  });
});

const getAllUsers = asyncHandler(async (_req, res) => {
  return res.status(200).json(db.users.map((u) => publicUser(u)));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = db.users.find((u) => u._id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const role = req.body?.role;
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  user.role = role;
  return res.status(200).json({ message: 'Role updated', user: publicUser(user) });
});

const deleteUser = asyncHandler(async (req, res) => {
  const index = db.users.findIndex((u) => u._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (db.users[index].role === 'admin') {
    return res.status(400).json({ message: 'Admin user cannot be deleted' });
  }

  db.users.splice(index, 1);
  return res.status(200).json({ message: 'User deleted successfully' });
});

const getAllSessions = asyncHandler(async (_req, res) => {
  const sessions = db.sessions.map((s) => {
    const user = db.users.find((u) => u._id === s.userId);
    return {
      ...s,
      userId: user ? { _id: user._id, name: user.name, email: user.email } : null
    };
  });

  return res.status(200).json(sessions);
});

module.exports = {
  getDashboard,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllSessions
};
