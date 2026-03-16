const { store, nextId } = require('../data/store');

function getAllPosts(req, res) {
  const posts = [...store.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json(posts);
}

function createPost(req, res) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const author = store.users.find((u) => u.id === req.user.id);
  const post = {
    _id: nextId('post'),
    title,
    description,
    author: {
      _id: author.id,
      name: author.name
    },
    createdAt: new Date().toISOString()
  };

  store.posts.push(post);
  return res.status(201).json(post);
}

function updatePost(req, res) {
  const post = store.posts.find((p) => p._id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.author._id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this post' });
  }

  post.title = req.body.title || post.title;
  post.description = req.body.description || post.description;

  return res.json(post);
}

function deletePost(req, res) {
  const index = store.posts.findIndex((p) => p._id === req.params.id);
  if (index < 0) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const post = store.posts[index];
  if (post.author._id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this post' });
  }

  store.posts.splice(index, 1);
  return res.json({ message: 'Post deleted successfully' });
}

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost
};
