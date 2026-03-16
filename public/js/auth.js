const PUBLIC_PAGES = [
  'index.html',
  'login.html',
  'register.html',
  'forgot-password.html',
  'reset-password.html',
  'verify-email.html',
  'about.html',
  'contact.html',
  'privacy.html'
];

function getCurrentPage() {
  const path = window.location.pathname;
  return path.split('/').pop() || 'index.html';
}

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const rawUser = localStorage.getItem('user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (err) {
    console.error('Invalid user data in storage', err);
    return null;
  }
}

function persistSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user || {}));

  if (data.expiresIn) {
    localStorage.setItem('token_expires', data.expiresIn);
  }
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('token_expires');
}

function redirectAfterLogin(user) {
  if (user?.role === 'admin') {
    window.location.href = 'admin.html';
    return;
  }

  window.location.href = 'forum.html';
}

// Check authentication status on protected pages.
function checkAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

async function login(email, password) {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, message: data.message || 'Login failed' };
    }

    persistSession(data);
    redirectAfterLogin(data.user);
    return { ok: true };
  } catch (error) {
    console.error('Login error:', error);
    return { ok: false, message: 'An error occurred during login' };
  }
}

async function register(name, email, password) {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, message: data.message || 'Registration failed' };
    }

    if (data.token) {
      persistSession(data);
      redirectAfterLogin(data.user);
      return { ok: true };
    }

    return { ok: true, message: 'Account created successfully. Please sign in.' };
  } catch (error) {
    console.error('Registration error:', error);
    return { ok: false, message: 'An error occurred during registration' };
  }
}

async function requestPasswordReset(email) {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, message: data.message || 'Failed to send reset link' };
    }

    return { ok: true, message: data.message || 'Password reset link sent to your email' };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { ok: false, message: 'Could not send reset email. Try again.' };
  }
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

// Keep client session tidy by expiring stale tokens.
setInterval(() => {
  const expires = localStorage.getItem('token_expires');
  if (!expires) return;

  const expiresAt = new Date(expires);
  if (Number.isNaN(expiresAt.getTime())) return;

  if (Date.now() >= expiresAt.getTime()) {
    clearSession();
    const page = getCurrentPage();
    if (!PUBLIC_PAGES.includes(page)) {
      window.location.href = 'login.html';
    }
  }
}, 60000);

document.addEventListener('DOMContentLoaded', () => {
  const page = getCurrentPage();

  if (!PUBLIC_PAGES.includes(page)) {
    checkAuth();
  }

  // If user is already authenticated, keep them out of auth pages.
  if ((page === 'login.html' || page === 'register.html') && getToken()) {
    redirectAfterLogin(getUser());
  }
});