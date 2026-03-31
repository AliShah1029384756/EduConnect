const asyncHandler = require('express-async-handler');
const { db, createId } = require('../utils/store');

const getEntries = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const entries = db.trackers[userId] || [];
  res.status(200).json({ entries });
});

const addEntry = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { focusHours = 0, mood = 'neutral', completedTasks = 0, notes = '' } = req.body || {};

  const entry = {
    _id: createId('t'),
    date: new Date().toISOString(),
    focusHours: Number(focusHours),
    mood,
    completedTasks: Number(completedTasks),
    notes
  };

  if (!db.trackers[userId]) {
    db.trackers[userId] = [];
  }

  db.trackers[userId].unshift(entry);
  res.status(201).json({ message: 'Tracker entry created', entry });
});

const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const entries = db.trackers[userId] || [];

  const totalFocusHours = entries.reduce((sum, e) => sum + (e.focusHours || 0), 0);
  const totalTasks = entries.reduce((sum, e) => sum + (e.completedTasks || 0), 0);
  const avgFocus = entries.length ? Number((totalFocusHours / entries.length).toFixed(2)) : 0;

  res.status(200).json({
    totalEntries: entries.length,
    totalFocusHours,
    totalTasks,
    avgFocus
  });
});

module.exports = {
  getEntries,
  addEntry,
  getSummary
};
