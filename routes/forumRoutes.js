const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { isAuthenticated } = require('../middleware/auth');
const { forumValidators, validateRequest } = require('../middleware/validators');

router.get('/all', isAuthenticated, forumController.getAllPosts);
router.get('/', isAuthenticated, forumController.getAllPosts);
router.post('/', isAuthenticated, forumValidators.createPost, validateRequest, forumController.createPost);
router.put('/:id', isAuthenticated, forumController.updatePost);
router.delete('/:id', isAuthenticated, forumController.deletePost);

module.exports = router;
