const { store } = require('../data/store');

function getUserByRequest(req) {
  return store.users.find((u) => u.id === req.user.id);
}

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

function getProfile(req, res) {
  const user = getUserByRequest(req);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(sanitizeUser(user));
}

function updateProfile(req, res) {
  const user = getUserByRequest(req);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, bio } = req.body;
  user.name = name || user.name;
  user.bio = bio || user.bio;

  return res.json(sanitizeUser(user));
}

function uploadProfileImage(req, res) {
  const user = getUserByRequest(req);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  user.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  return res.json({ imageUrl: user.imageUrl });
}

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage
};
