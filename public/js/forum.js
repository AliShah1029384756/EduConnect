// Global variables
let currentUser = null;

// Initialize forum page
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      redirectToLogin();
      return;
    }

    // Get current user from localStorage
    currentUser = JSON.parse(localStorage.getItem('user'));

    // Initialize forum functionality
    await initializeForum();

  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to initialize forum');
  }
});

// Main forum initialization
async function initializeForum() {
  // Load and display posts
  await loadAndRenderPosts();

  // Setup event listeners
  setupEventListeners();

  // Initialize Bootstrap tooltips
  initTooltips();
}

// Load and render posts
async function loadAndRenderPosts() {
  try {
    showLoader('#postsContainer');
    
    const posts = await fetchPosts();
    
    if (posts.length === 0) {
      showNoPostsMessage();
    } else {
      renderPosts(posts);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
    showError('Failed to load posts', '#postsContainer');
  }
}

// Fetch posts from API
async function fetchPosts() {
  const response = await fetch('/api/forum/all', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Render posts to the DOM
function renderPosts(posts) {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';

  posts.forEach(post => {
    const postElement = createPostElement(post);
    container.appendChild(postElement);
  });

  // Add delete functionality for user's own posts
  if (currentUser) {
    setupDeleteButtons();
  }
}

// Create HTML element for a single post
function createPostElement(post) {
  const element = document.createElement('div');
  element.className = 'card mb-3 post-card';
  element.innerHTML = `
    <div class="card-body">
      <h5 class="card-title post-title">${escapeHtml(post.title)}</h5>
      <p class="card-text post-content">${escapeHtml(post.description)}</p>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">
          Posted by ${post.author?.name || 'Anonymous'} on 
          ${new Date(post.createdAt).toLocaleDateString()}
        </small>
        ${showDeleteButton(post)}
      </div>
    </div>
  `;
  return element;
}

// Show delete button for user's own posts
function showDeleteButton(post) {
  if (currentUser && post.author?._id === currentUser.id) {
    return `
      <button class="btn btn-sm btn-danger delete-post" data-id="${post._id}" title="Delete post">
        <i class="bi bi-trash"></i>
      </button>
    `;
  }
  return '';
}

// Setup all event listeners
function setupEventListeners() {
  // New post form submission
  document.getElementById('postForm')?.addEventListener('submit', handlePostSubmit);

  // Search functionality
  document.getElementById('searchInput')?.addEventListener('input', handleSearch);

  // Modal show/hide events
  const postModal = document.getElementById('newPostModal');
  if (postModal) {
    postModal.addEventListener('show.bs.modal', resetPostForm);
    postModal.addEventListener('hidden.bs.modal', resetPostForm);
  }
}

// Handle post submission
async function handlePostSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('postTitle').value.trim();
  const description = document.getElementById('postDescription').value.trim();

  if (!title || !description) {
    showAlert('Please fill in all fields', 'warning');
    return;
  }

  try {
    const response = await fetch('/api/forum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, description })
    });

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
      modal.hide();
      await loadAndRenderPosts();
      showAlert('Post created successfully!', 'success');
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create post');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    showAlert(error.message || 'Failed to create post', 'danger');
  }
}

// Handle search functionality
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const posts = document.querySelectorAll('.post-card');
  
  posts.forEach(post => {
    const title = post.querySelector('.post-title').textContent.toLowerCase();
    const content = post.querySelector('.post-content').textContent.toLowerCase();
    post.style.display = (title.includes(searchTerm) || content.includes(searchTerm)) 
      ? 'block' 
      : 'none';
  });
}

// Setup delete buttons with event listeners
function setupDeleteButtons() {
  document.querySelectorAll('.delete-post').forEach(button => {
    button.addEventListener('click', handleDeletePost);
  });
}

// Handle post deletion
async function handleDeletePost(e) {
  const postId = e.currentTarget.getAttribute('data-id');
  
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }

  try {
    const response = await fetch(`/api/forum/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      await loadAndRenderPosts();
      showAlert('Post deleted successfully', 'success');
    } else {
      throw new Error('Failed to delete post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    showAlert('Failed to delete post', 'danger');
  }
}

// Helper functions
function redirectToLogin() {
  window.location.href = '/login.html';
}

function showLoader(container) {
  const target = document.querySelector(container);
  if (target) {
    target.innerHTML = `
      <div class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading posts...</p>
      </div>
    `;
  }
}

function showNoPostsMessage() {
  const container = document.getElementById('postsContainer');
  container.innerHTML = `
    <div class="alert alert-info text-center">
      No posts found. Be the first to post!
    </div>
  `;
}

function showError(message, container = 'body') {
  const target = document.querySelector(container);
  if (target) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    target.prepend(alert);
    
    setTimeout(() => alert.remove(), 5000);
  }
}

function showAlert(message, type) {
  const normalized = type === 'danger' ? 'error' : type;
  showToast(message, normalized);
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