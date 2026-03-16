function ensureToastContainer() {
  let container = document.getElementById('toastContainer');
  if (container) return container;

  container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.style.zIndex = '1090';
  document.body.appendChild(container);
  return container;
}

function showToast(message, type = 'info', timeout = 3500) {
  const typeClassMap = {
    success: 'text-bg-success',
    error: 'text-bg-danger',
    danger: 'text-bg-danger',
    warning: 'text-bg-warning',
    info: 'text-bg-primary'
  };

  const toastClass = typeClassMap[type] || typeClassMap.info;
  const container = ensureToastContainer();
  const el = document.createElement('div');
  el.className = `toast align-items-center border-0 ${toastClass}`;
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'assertive');
  el.setAttribute('aria-atomic', 'true');
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(el);
  const toast = new bootstrap.Toast(el, { delay: timeout });
  toast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}
