document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) return;

  document.getElementById('searchInput').addEventListener('input', loadResources);
  document.getElementById('categoryInput').addEventListener('change', loadResources);
  await loadResources();
});

async function loadResources() {
  const q = document.getElementById('searchInput').value.trim();
  const category = document.getElementById('categoryInput').value;
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);

  const response = await apiFetch(`/api/resources?${params.toString()}`);
  if (!response.ok) {
    return;
  }

  const data = await response.json();
  renderResources(data.resources || []);
}

function renderResources(resources) {
  const container = document.getElementById('resourcesContainer');
  container.innerHTML = '';

  if (!resources.length) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-info">No resources found.</div></div>';
    return;
  }

  resources.forEach((item) => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${escapeHtml(item.title)}</h5>
            <span class="badge bg-secondary">${item.level}</span>
          </div>
          <p class="text-muted small text-uppercase mb-1">${item.category} • ${item.type}</p>
          <p class="card-text">${escapeHtml(item.description)}</p>
          <div class="mt-auto d-flex gap-2">
            <a class="btn btn-sm btn-outline-primary" href="${item.link}" target="_blank" rel="noopener">Open</a>
            <button class="btn btn-sm ${item.bookmarked ? 'btn-success' : 'btn-outline-success'}" data-id="${item.id}">
              ${item.bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </div>
      </div>
    `;

    col.querySelector('button').addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      await apiFetch(`/api/resources/bookmark/${id}`, { method: 'POST' });
      await loadResources();
    });

    container.appendChild(col);
  });
}

function escapeHtml(text = '') {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
