// Handle login form submission
document.getElementById('signin-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('token_expires', data.expiresIn);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = '/admin.html';
      } else {
        window.location.href = '/forum.html';
      }
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Login failed. Please try again.');
  }
});

// Check token expiration every minute
setInterval(() => {
  const token = localStorage.getItem('token');
  const expires = localStorage.getItem('token_expires');
  
  if (token && expires) {
    const now = new Date();
    const expiresAt = new Date(expires);
    const timeLeft = expiresAt - now;
    
    if (timeLeft < 300000 && timeLeft > 0) { // 5 minutes
      alert(`Your session will expire in ${Math.floor(timeLeft / 60000)} minutes. Please save your work.`);
    }
    
    if (timeLeft <= 0) {
      localStorage.clear();
      window.location.href = '/index1.html';
    }
  }
}, 60000); // Check every minute

// Initialize check on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token && !window.location.pathname.includes('index1.html')) {
    window.location.href = '/index1.html';
  }
});

// Check authentication status
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
  }
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'forum.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Check token expiration every 5 minutes
setInterval(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetch('/api/auth/check-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.expiresSoon) {
          alert(`Your session will expire in ${data.minutesLeft} minutes`);
        }
      });
  }
}, 300000); // 5 minutes

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);