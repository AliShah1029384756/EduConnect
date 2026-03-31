const asyncHandler = require('express-async-handler');
const { db, createId } = require('../utils/store');

const allowedStatus = ['pending', 'confirmed', 'cancelled', 'completed'];

const getSessions = asyncHandler(async (req, res) => {
  const sessions = db.sessions
    .filter((s) => req.user.role === 'admin' || req.user.role === 'counselor' || s.userId === req.user.id)
    .map((s) => {
      const owner = db.users.find((u) => u._id === s.userId);
      return {
        ...s,
        user: owner ? { _id: owner._id, name: owner.name, email: owner.email } : null
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json({ sessions });
});

const bookSession = asyncHandler(async (req, res) => {
  const { topic, preferredDate, preferredTime, notes = '' } = req.body || {};
  if (!topic || !preferredDate || !preferredTime) {
    return res.status(400).json({ message: 'topic, preferredDate and preferredTime are required' });
  }

  const session = {
    _id: createId('s'),
    userId: req.user.id,
    topic: String(topic).trim(),
    preferredDate,
    preferredTime,
    notes: String(notes),
    status: 'pending',
    createdAt: Date.now()
  };

  db.sessions.push(session);
  res.status(201).json({ message: 'Session booked successfully', session });
});

const updateSession = asyncHandler(async (req, res) => {
  const session = db.sessions.find((s) => s._id === req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const canEdit = req.user.role === 'admin' || req.user.role === 'counselor' || session.userId === req.user.id;
  if (!canEdit) {
    return res.status(403).json({ message: 'Not allowed to update this session' });
  }

  const { topic, preferredDate, preferredTime, notes, status } = req.body || {};
  if (topic !== undefined) session.topic = String(topic);
  if (preferredDate !== undefined) session.preferredDate = preferredDate;
  if (preferredTime !== undefined) session.preferredTime = preferredTime;
  if (notes !== undefined) session.notes = String(notes);
  if (status && allowedStatus.includes(status)) session.status = status;

  res.status(200).json({ message: 'Session updated', session });
});

const deleteSession = asyncHandler(async (req, res) => {
  const index = db.sessions.findIndex((s) => s._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const session = db.sessions[index];
  const canDelete = req.user.role === 'admin' || session.userId === req.user.id;
  if (!canDelete) {
    return res.status(403).json({ message: 'Not allowed to delete this session' });
  }

  db.sessions.splice(index, 1);
  res.status(200).json({ message: `Session ${req.params.id} deleted` });
});

module.exports = {
  getSessions,
  bookSession,
  updateSession,
  deleteSession
};
