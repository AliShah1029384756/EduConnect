const asyncHandler = require('express-async-handler');
const { db } = require('../utils/store');

const getResources = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const category = (req.query.category || '').toLowerCase();

  const items = db.resources.filter((item) => {
    const byQuery = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    const byCategory = !category || item.category.toLowerCase() === category;
    return byQuery && byCategory;
  });

  const bookmarked = db.bookmarks[req.user.id] || [];
  const resources = items.map((r) => ({ ...r, bookmarked: bookmarked.includes(r.id) }));

  res.status(200).json({ resources });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!db.bookmarks[userId]) {
    db.bookmarks[userId] = [];
  }

  const exists = db.bookmarks[userId].includes(id);
  if (exists) {
    db.bookmarks[userId] = db.bookmarks[userId].filter((x) => x !== id);
  } else {
    db.bookmarks[userId].push(id);
  }

  res.status(200).json({
    message: exists ? 'Bookmark removed' : 'Bookmarked',
    bookmarks: db.bookmarks[userId]
  });
});

const getBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const ids = db.bookmarks[userId] || [];
  const resources = db.resources.filter((r) => ids.includes(r.id));
  res.status(200).json({ resources });
});

module.exports = {
  getResources,
  toggleBookmark,
  getBookmarks
};
