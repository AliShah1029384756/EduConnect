document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) return;

  await loadSessions();
  bindBookingForm();
});

function bindBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createSession();
  });
}

async function loadSessions() {
  const container = document.getElementById('sessionsContainer');
  if (!container) return;

  container.innerHTML = '<p class="text-muted">Loading sessions...</p>';

  try {
    const response = await fetch('/api/counseling', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Could not load sessions');
    }

    const sessions = await response.json();
    renderSessions(sessions);
  } catch (error) {
    console.error('Counseling load error:', error);
    container.innerHTML = '<div class="alert alert-danger">Unable to load sessions.</div>';
  }
}

function renderSessions(sessions) {
  const container = document.getElementById('sessionsContainer');
  container.innerHTML = '';

  if (!Array.isArray(sessions) || sessions.length === 0) {
    container.innerHTML = '<div class="alert alert-info">No sessions yet. Book your first session.</div>';
    return;
  }

  sessions.forEach((session) => {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-4';
    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(session.topic || 'Session')}</h5>
          <p class="card-text mb-2"><strong>Date:</strong> ${formatDate(session.preferredDate)}</p>
          <p class="card-text mb-3"><strong>Status:</strong> <span class="badge bg-${statusColor(session.status)}">${escapeHtml(session.status || 'pending')}</span></p>
          <p class="card-text text-muted">${escapeHtml(session.notes || 'No additional notes')}</p>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-outline-success" onclick="markSession('${session._id}','confirm')">Confirm</button>
            <button class="btn btn-sm btn-outline-warning" onclick="markSession('${session._id}','reschedule')">Reschedule</button>
            <button class="btn btn-sm btn-outline-danger" onclick="markSession('${session._id}','cancel')">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

async function markSession(id, action) {
  try {
    let body = undefined;
    if (action === 'reschedule') {
      const date = prompt('Enter new date/time (YYYY-MM-DDTHH:mm)');
      if (!date) return;
      body = JSON.stringify({ preferredDate: new Date(date).toISOString(), status: 'pending' });
    }

    const response = await fetch(`/api/counseling/${id}/${action}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Action failed');

    showToast(`Session ${action}ed successfully.`, 'success');
    await loadSessions();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function createSession() {
  const topic = document.getElementById('topicSelect').value;
  const date = document.getElementById('sessionDate').value;
  const time = document.getElementById('sessionTime').value;
  const notes = document.getElementById('sessionNotes').value.trim();

  if (!topic || !date || !time) {
    showToast('Please fill topic, date, and time.', 'warning');
    return;
  }

  try {
    const payload = {
      topic,
      preferredDate: new Date(`${date}T${time}`).toISOString(),
      notes
    };

    const response = await fetch('/api/counseling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Booking request failed');
    }

    const modalElement = document.getElementById('bookingModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    document.getElementById('bookingForm').reset();
    await loadSessions();
    showToast('Session booked successfully.', 'success');
  } catch (error) {
    console.error('Booking error:', error);
    showToast(error.message || 'Unable to book session', 'error');
  }
}

function formatDate(value) {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleString();
}

function statusColor(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'confirmed') return 'success';
  if (normalized === 'cancelled') return 'danger';
  return 'warning';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
