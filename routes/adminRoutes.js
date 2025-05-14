const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllSessions
} = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/users', isAuthenticated, isAdmin, getAllUsers);
router.put('/users/:id/role', isAuthenticated, isAdmin, updateUserRole);
router.delete('/users/:id', isAuthenticated, isAdmin, deleteUser);
router.get('/sessions', isAuthenticated, isAdmin, getAllSessions);

module.exports = router;