const asyncHandler = require('express-async-handler');
const { db, createId } = require('../utils/store');

const getAllPosts = asyncHandler(async (_req, res) => {
  const posts = db.posts
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((post) => {
      const author = db.users.find((u) => u._id === post.authorId);
      return {
        _id: post._id,
        title: post.title,
        description: post.description,
        createdAt: post.createdAt,
        author: {
          _id: author?._id || 'unknown',
          name: author?.name || 'Anonymous'
        }
      };
    });

  res.status(200).json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ message: 'title and description are required' });
  }

  const post = {
    _id: createId('p'),
    title: String(title).trim(),
    description: String(description).trim(),
    authorId: req.user.id,
    createdAt: Date.now()
  };

  db.posts.push(post);
  return res.status(201).json({ message: 'Forum post created', post });
});

const deletePost = asyncHandler(async (req, res) => {
  const index = db.posts.findIndex((p) => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const post = db.posts[index];
  if (post.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed to delete this post' });
  }

  db.posts.splice(index, 1);
  return res.status(200).json({ message: `Forum post ${req.params.id} deleted` });
});

module.exports = {
  getAllPosts,
  createPost,
  deletePost
};
