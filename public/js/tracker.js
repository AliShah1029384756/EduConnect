document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) return;

  document.getElementById('trackerForm').addEventListener('submit', submitEntry);
  await loadTracker();
});

async function submitEntry(e) {
  e.preventDefault();
  const payload = {
    focusHours: document.getElementById('focusHours').value,
    mood: document.getElementById('mood').value,
    completedTasks: document.getElementById('completedTasks').value,
    notes: document.getElementById('notes').value.trim()
  };

  const response = await apiFetch('/api/tracker', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    e.target.reset();
    await loadTracker();
  }
}

async function loadTracker() {
  const [entriesRes, summaryRes] = await Promise.all([
    apiFetch('/api/tracker'),
    apiFetch('/api/tracker/summary')
  ]);

  if (!entriesRes.ok || !summaryRes.ok) return;

  const entriesData = await entriesRes.json();
  const summaryData = await summaryRes.json();
  renderSummary(summaryData);
  renderEntries(entriesData.entries || []);
}

function renderSummary(summary) {
  const box = document.getElementById('summaryBox');
  box.innerHTML = `
    <div class="col-6"><div class="p-2 bg-light rounded">Entries: <strong>${summary.totalEntries}</strong></div></div>
    <div class="col-6"><div class="p-2 bg-light rounded">Focus Hours: <strong>${summary.totalFocusHours}</strong></div></div>
    <div class="col-6"><div class="p-2 bg-light rounded">Tasks: <strong>${summary.totalTasks}</strong></div></div>
    <div class="col-6"><div class="p-2 bg-light rounded">Avg Focus: <strong>${summary.avgFocus}</strong></div></div>
  `;
}

function renderEntries(entries) {
  const box = document.getElementById('entriesBox');
  if (!entries.length) {
    box.innerHTML = '<div class="alert alert-info">No entries yet.</div>';
    return;
  }

  box.innerHTML = entries.slice(0, 10).map((entry) => `
    <div class="border rounded p-2 mb-2">
      <div class="d-flex justify-content-between">
        <strong>${new Date(entry.date).toLocaleString()}</strong>
        <span class="badge bg-primary">${entry.mood}</span>
      </div>
      <div class="small text-muted">Focus: ${entry.focusHours}h • Tasks: ${entry.completedTasks}</div>
      <div>${escapeHtml(entry.notes || '')}</div>
    </div>
  `).join('');
}

function escapeHtml(text = '') {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
