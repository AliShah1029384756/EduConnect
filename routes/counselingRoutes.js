const express = require('express');
const router = express.Router();
const {
  getSessions,
  bookSession,
  updateSession,
  deleteSession
} = require('../controllers/counselingController');
const { isAuthenticated } = require('../middleware/auth');
const { counselingValidators, validateRequest } = require('../middleware/validators');

router.get('/', isAuthenticated, getSessions);
router.post('/', isAuthenticated, counselingValidators.createSession, validateRequest, bookSession);
router.put('/:id', isAuthenticated, updateSession);
router.patch('/:id/confirm', isAuthenticated, (req, res, next) => {
  req.body.status = 'confirmed';
  next();
}, updateSession);
router.patch('/:id/reschedule', isAuthenticated, updateSession);
router.patch('/:id/cancel', isAuthenticated, (req, res, next) => {
  req.body.status = 'cancelled';
  next();
}, updateSession);
router.delete('/:id', isAuthenticated, deleteSession);

module.exports = router;