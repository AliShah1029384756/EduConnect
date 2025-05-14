const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfileImage
} = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', isAuthenticated, getProfile);
router.put('/', isAuthenticated, updateProfile);
router.post('/upload', isAuthenticated, upload.single('image'), uploadProfileImage);

module.exports = router;