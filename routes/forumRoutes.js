const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
//const authenticate = require('../middleware/authenticate');


router.post('/', authenticate, forumController.createPost);
//router.put('/:id', authenticate, forumController.updatePost); // ✅ This now works
router.delete('/:id', authenticate, forumController.deletePost);


module.exports = router;
