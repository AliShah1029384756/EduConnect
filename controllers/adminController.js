const { store } = require('../data/store');

function getDashboardStats(req, res) {
  return res.json({
    usersCount: store.users.length,
    sessionsCount: store.sessions.length,
    postsCount: store.posts.length
  });
}

function getAllUsers(req, res) {
  const users = store.users.map((u) => ({
    _id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  }));

  return res.json(users);
}

function updateUserRole(req, res) {
  const { role } = req.body;
  const allowedRoles = ['user', 'counselor', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = store.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = role;
  return res.json({ message: 'Role updated successfully' });
}

function deleteUser(req, res) {
  const index = store.users.findIndex((u) => u.id === req.params.id);
  if (index < 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  store.users.splice(index, 1);
  return res.json({ message: 'User deleted successfully' });
}

function getAllSessions(req, res) {
  const sessions = store.sessions.map((s) => {
    const user = store.users.find((u) => u.id === s.userId);
    return {
      ...s,
      userId: user ? { _id: user.id, name: user.name } : null
    };
  });

  return res.json(sessions);
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllSessions
};
