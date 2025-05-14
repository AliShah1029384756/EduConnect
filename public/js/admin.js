document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) return;

  const user = JSON.parse(localStorage.getItem('user'));
  if (user.role !== 'admin') {
    window.location.href = 'forum.html';
    return;
  }

  await loadDashboardStats();
  await loadUsers();

  // Tab switching
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('click', async (e) => {
      if (e.target.getAttribute('data-bs-target') === '#sessionsTab') {
        await loadSessions();
      }
    });
  });
});

async function loadDashboardStats() {
  try {
    const response = await fetch('/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const stats = await response.json();
      document.getElementById('usersCount').textContent = stats.usersCount;
      document.getElementById('sessionsCount').textContent = stats.sessionsCount;
      document.getElementById('postsCount').textContent = stats.postsCount;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadUsers() {
  try {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const users = await response.json();
      renderUsers(users);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function loadSessions() {
  try {
    const response = await fetch('/api/admin/sessions', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const sessions = await response.json();
      renderSessions(sessions);
    }
  } catch (error) {
    console.error('Error loading sessions:', error);
  }
}

function renderUsers(users) {
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <select class="form-select form-select-sm user-role" 
                data-user-id="${user._id}" 
                onchange="updateUserRole('${user._id}', this.value)">
          <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
          <option value="counselor" ${user.role === 'counselor' ? 'selected' : ''}>Counselor</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </td>
      <td>
        <button class="btn btn-sm btn-danger" 
                onclick="deleteUser('${user._id}')">
          Delete
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSessions(sessions) {
  const tbody = document.getElementById('sessionsTable');
  tbody.innerHTML = '';

  sessions.forEach(session => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${session.userId?.name || 'Guest'}</td>
      <td>${session.topic}</td>
      <td>${new Date(session.preferredDate).toLocaleDateString()}</td>
      <td>
        <span class="badge bg-${getStatusColor(session.status)}">
          ${session.status}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function updateUserRole(userId, role) {
  try {
    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      throw new Error('Failed to update role');
    }
  } catch (error) {
    console.error('Error updating role:', error);
    showAlert('Failed to update user role', 'danger');
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      await loadUsers();
      showAlert('User deleted successfully', 'success');
    } else {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showAlert('Failed to delete user', 'danger');
  }
}

function getStatusColor(status) {
  switch(status.toLowerCase()) {
    case 'confirmed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
}