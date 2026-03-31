let cachedPosts = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) return;

  const user = getUser();
  const display = document.getElementById('usernameDisplay');
  if (display) {
    display.textContent = user?.name || 'Student';
  }

  document.getElementById('postForm')?.addEventListener('submit', handlePostSubmit);
  document.getElementById('searchInput')?.addEventListener('input', applyFilter);
  await loadPosts();
});

async function loadPosts() {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '<div class="col-12"><div class="alert alert-secondary">Loading posts...</div></div>';

  const response = await apiFetch('/api/forum/all');
  if (!response.ok) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Could not load forum posts.</div></div>';
    return;
  }

  cachedPosts = await response.json();
  renderPosts(cachedPosts);
}

function applyFilter(e) {
  const term = (e.target.value || '').toLowerCase();
  const filtered = cachedPosts.filter((post) => {
    return post.title.toLowerCase().includes(term) || post.description.toLowerCase().includes(term);
  });
  renderPosts(filtered);
}

function renderPosts(posts) {
  const user = getUser();
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';

  if (!posts.length) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-info">No posts yet. Start the discussion.</div></div>';
    return;
  }

  posts.forEach((post) => {
    const own = post.author?._id === user?._id || post.author?._id === user?.id || user?.role === 'admin';
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card post-card h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title post-title">${escapeHtml(post.title)}</h5>
          <p class="card-text post-content">${escapeHtml(post.description)}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <small class="text-muted">${escapeHtml(post.author?.name || 'Anonymous')} • ${new Date(post.createdAt).toLocaleString()}</small>
            ${own ? `<button class="btn btn-sm btn-outline-danger" data-id="${post._id}">Delete</button>` : ''}
          </div>
        </div>
      </div>
    `;

    const btn = col.querySelector('button[data-id]');
    if (btn) {
      btn.addEventListener('click', () => removePost(btn.getAttribute('data-id')));
    }

    container.appendChild(col);
  });
}

async function handlePostSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('postTitle').value.trim();
  const description = document.getElementById('postDescription').value.trim();

  if (!title || !description) {
    alert('Title and content are required.');
    return;
  }

  const response = await apiFetch('/api/forum', {
    method: 'POST',
    body: JSON.stringify({ title, description })
  });

  if (!response.ok) {
    const err = await response.json();
    alert(err.message || 'Could not create post');
    return;
  }

  const modalEl = document.getElementById('newPostModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  e.target.reset();
  await loadPosts();
}

async function removePost(id) {
  const ok = confirm('Delete this post?');
  if (!ok) return;

  const response = await apiFetch(`/api/forum/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const err = await response.json();
    alert(err.message || 'Delete failed');
    return;
  }

  await loadPosts();
}

function escapeHtml(text = '') {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  const container = document.getElementById('alertsContainer') || document.body;
  container.prepend(alert);
  
  setTimeout(() => {
    const bsAlert = new bootstrap.Alert(alert);
    bsAlert.close();
  }, 5000);
}

function resetPostForm() {
  const form = document.getElementById('postForm');
  if (form) form.reset();
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}