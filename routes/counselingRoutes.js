const express = require('express');
const router = express.Router();
const {
  getSessions,
  bookSession,
  updateSession,
  deleteSession
} = require('../controllers/counselingController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getSessions);
router.post('/', isAuthenticated, bookSession);
router.put('/:id', isAuthenticated, updateSession);
router.delete('/:id', isAuthenticated, deleteSession);

module.exports = router;