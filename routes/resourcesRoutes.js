const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  getResources,
  toggleBookmark,
  getBookmarks
} = require('../controllers/resourcesController');

router.get('/', isAuthenticated, getResources);
router.get('/bookmarks', isAuthenticated, getBookmarks);
router.post('/bookmark/:id', isAuthenticated, toggleBookmark);

module.exports = router;
