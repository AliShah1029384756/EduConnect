const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { isAuthenticated } = require('../middleware/auth');


router.get('/all', isAuthenticated, forumController.getAllPosts);
router.post('/', isAuthenticated, forumController.createPost);
router.delete('/:id', isAuthenticated, forumController.deletePost);


module.exports = router;
