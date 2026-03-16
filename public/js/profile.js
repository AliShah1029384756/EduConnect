document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) return;

  const user = JSON.parse(localStorage.getItem('user'));
  loadProfile(user);

  // Form submission
  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateProfile();
  });

  // Image upload
  document.getElementById('imageUpload').addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await uploadImage(e.target.files[0]);
    }
  });
});

function loadProfile(user) {
  document.getElementById('nameInput').value = user.name || '';
  document.getElementById('emailInput').value = user.email || '';
  document.getElementById('bioInput').value = user.bio || '';
  
  if (user.imageUrl) {
    document.getElementById('profileImage').src = user.imageUrl;
  }
}

async function updateProfile() {
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: document.getElementById('nameInput').value,
        bio: document.getElementById('bioInput').value
      })
    });

    if (response.ok) {
      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showAlert('Profile updated successfully!', 'success');
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/profile/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('profileImage').src = data.imageUrl;
      
      // Update local user data
      const user = JSON.parse(localStorage.getItem('user'));
      user.imageUrl = data.imageUrl;
      localStorage.setItem('user', JSON.stringify(user));
      
      showAlert('Profile image updated!', 'success');
    } else {
      throw new Error('Failed to upload image');
    }
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

function showAlert(message, type) {
  const normalized = type === 'danger' ? 'error' : type;
  showToast(message, normalized);
}