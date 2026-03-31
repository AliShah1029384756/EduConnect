const asyncHandler = require('express-async-handler');
const { db, publicUser } = require('../utils/store');

const getProfile = asyncHandler(async (req, res) => {
  const user = db.users.find((u) => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ profile: publicUser(user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = db.users.find((u) => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, bio } = req.body || {};
  if (name !== undefined) user.name = String(name).trim();
  if (bio !== undefined) user.bio = String(bio).trim();

  return res.status(200).json(publicUser(user));
});

const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const user = db.users.find((u) => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.imageUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({
    message: 'Profile image uploaded successfully',
    imageUrl: user.imageUrl
  });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage
};
