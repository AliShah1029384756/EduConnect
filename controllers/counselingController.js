const { store, nextId } = require('../data/store');

function getSessions(req, res) {
  if (req.user.role === 'admin') {
    return res.json(store.sessions);
  }

  const sessions = store.sessions.filter((s) => s.userId === req.user.id);
  return res.json(sessions);
}

function bookSession(req, res) {
  const { topic, preferredDate, notes } = req.body;
  if (!topic || !preferredDate) {
    return res.status(400).json({ message: 'topic and preferredDate are required' });
  }

  const session = {
    _id: nextId('session'),
    userId: req.user.id,
    topic,
    preferredDate,
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  store.sessions.push(session);
  return res.status(201).json(session);
}

function updateSession(req, res) {
  const session = store.sessions.find((s) => s._id === req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (session.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized for this session' });
  }

  session.topic = req.body.topic || session.topic;
  session.preferredDate = req.body.preferredDate || session.preferredDate;
  session.notes = req.body.notes ?? session.notes;
  session.status = req.body.status || session.status;

  return res.json(session);
}

function deleteSession(req, res) {
  const index = store.sessions.findIndex((s) => s._id === req.params.id);
  if (index < 0) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const session = store.sessions[index];
  if (session.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized for this session' });
  }

  store.sessions.splice(index, 1);
  return res.json({ message: 'Session deleted successfully' });
}

module.exports = {
  getSessions,
  bookSession,
  updateSession,
  deleteSession
};
