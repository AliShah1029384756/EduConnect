document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) return;

  document.getElementById('bookingForm').addEventListener('submit', submitSession);
  await loadSessions();
});

async function submitSession(e) {
  e.preventDefault();

  const payload = {
    topic: document.getElementById('topicSelect').value,
    preferredDate: document.getElementById('sessionDate').value,
    preferredTime: document.getElementById('sessionTime').value,
    notes: document.getElementById('sessionNotes').value.trim()
  };

  const response = await apiFetch('/api/counseling', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    alert(err.message || 'Booking failed');
    return;
  }

  e.target.reset();
  const modalEl = document.getElementById('bookingModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  await loadSessions();
}

async function loadSessions() {
  const container = document.getElementById('sessionsContainer');
  container.innerHTML = '<div class="col-12"><div class="alert alert-secondary">Loading sessions...</div></div>';

  const response = await apiFetch('/api/counseling');
  if (!response.ok) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Could not load sessions.</div></div>';
    return;
  }

  const data = await response.json();
  const sessions = data.sessions || [];

  if (!sessions.length) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-info">No sessions yet. Book your first counseling session.</div></div>';
    return;
  }

  container.innerHTML = sessions.map((s) => `
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="card-title mb-0">${escapeHtml(s.topic)}</h5>
            <span class="badge bg-${statusColor(s.status)} text-uppercase">${s.status}</span>
          </div>
          <p class="card-text mb-1"><strong>Date:</strong> ${escapeHtml(s.preferredDate)}</p>
          <p class="card-text mb-1"><strong>Time:</strong> ${escapeHtml(s.preferredTime)}</p>
          <p class="card-text"><strong>Notes:</strong> ${escapeHtml(s.notes || '-')}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function statusColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'completed':
      return 'primary';
    default:
      return 'warning';
  }
}

function escapeHtml(text = '') {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}