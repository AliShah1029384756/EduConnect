const PUBLIC_PATHS = ['/login.html', '/register.html', '/forgot-password.html', '/index.html'];

function isPublicPage() {
  return PUBLIC_PATHS.some((p) => window.location.pathname.endsWith(p)) || window.location.pathname === '/';
}

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (_err) {
    return null;
  }
}

function saveSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('token_expires', data.expiresIn);
  localStorage.setItem('user', JSON.stringify(data.user));
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('token_expires');
  localStorage.removeItem('user');
}

function checkAuth() {
  const token = getToken();
  if (!token && !isPublicPage()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

async function apiFetch(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    'Content-Type': options.body instanceof FormData ? undefined : 'application/json'
  };

  if (headers['Content-Type'] === undefined) {
    delete headers['Content-Type'];
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401 && !isPublicPage()) {
    clearSession();
    window.location.href = 'login.html';
  }

  return response;
}

async function login(email, password) {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  saveSession(data);
  return data;
}

async function register(payload) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  saveSession(data);
  return data;
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

let warnedSoon = false;
setInterval(async () => {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch('/api/auth/check-token', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      clearSession();
      if (!isPublicPage()) {
        window.location.href = 'login.html';
      }
      return;
    }

    const data = await response.json();
    if (data.expiresSoon && !warnedSoon) {
      warnedSoon = true;
      alert(`Session will expire in ${data.minutesLeft} minute(s).`);
    }
  } catch (_err) {
    // Silent network check; next action occurs on real API calls.
  }
}, 300000);

window.checkAuth = checkAuth;
window.login = login;
window.register = register;
window.logout = logout;
window.apiFetch = apiFetch;
window.getUser = getUser;

document.addEventListener('DOMContentLoaded', () => {
  if (!isPublicPage()) {
    checkAuth();
  }
});