const bcrypt = require('bcryptjs');

const now = Date.now();

const resources = [
  {
    id: 'r1',
    title: 'Time Management for University Students',
    category: 'study-skills',
    type: 'article',
    level: 'beginner',
    link: 'https://www.coursera.org/articles/time-management-skills',
    description: 'Practical framework for planning study blocks and reducing procrastination.'
  },
  {
    id: 'r2',
    title: 'Career Roadmap Template',
    category: 'career',
    type: 'template',
    level: 'intermediate',
    link: 'https://roadmap.sh',
    description: 'Use this to build a semester-wise career plan with milestones.'
  },
  {
    id: 'r3',
    title: 'Managing Academic Stress',
    category: 'wellbeing',
    type: 'guide',
    level: 'beginner',
    link: 'https://www.mind.org.uk',
    description: 'Quick coping strategies and when to seek professional support.'
  }
];

const db = {
  users: [
    {
      _id: 'u1',
      name: 'Admin User',
      email: 'admin@educonnect.com',
      passwordHash: bcrypt.hashSync('Admin@123', 10),
      role: 'admin',
      bio: 'Platform administrator',
      imageUrl: ''
    }
  ],
  posts: [
    {
      _id: 'p1',
      title: 'Welcome to EduConnect Forum',
      description: 'Introduce yourself and share your academic goals for this semester.',
      authorId: 'u1',
      createdAt: now - 86400000
    }
  ],
  sessions: [],
  resources,
  trackers: {},
  bookmarks: {}
};

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function publicUser(user) {
  if (!user) return null;
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio || '',
    imageUrl: user.imageUrl || ''
  };
}

module.exports = {
  db,
  createId,
  publicUser
};
