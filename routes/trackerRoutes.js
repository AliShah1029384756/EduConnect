const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  getEntries,
  addEntry,
  getSummary
} = require('../controllers/trackerController');

router.get('/', isAuthenticated, getEntries);
router.post('/', isAuthenticated, addEntry);
router.get('/summary', isAuthenticated, getSummary);

module.exports = router;
