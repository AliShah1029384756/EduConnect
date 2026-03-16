const bcrypt = require('bcryptjs');

const seedAdminPassword = bcrypt.hashSync('admin123', 10);

const store = {
  users: [
    {
      id: 'u-admin-1',
      name: 'Admin User',
      email: 'admin@educonnect.local',
      role: 'admin',
      passwordHash: seedAdminPassword,
      bio: 'Platform administrator',
      imageUrl: ''
    }
  ],
  posts: [],
  sessions: [],
  passwordResetRequests: []
};

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = {
  store,
  nextId
};
