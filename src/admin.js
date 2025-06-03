// Admin Login Logic
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    const res = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    const data = await res.json();
    const msg = document.getElementById('adminLoginMsg');
    if (res.ok && data.token) {
      msg.className = 'alert alert-success mt-3';
      msg.textContent = 'Login successful! Redirecting...';
      msg.classList.remove('d-none');
      setTimeout(() => {
        window.location.href = 'admin-panel.html';
      }, 1000);
    } else {
      msg.className = 'alert alert-danger mt-3';
      msg.textContent = data.message || 'Invalid credentials.';
      msg.classList.remove('d-none');
    }
  });
}
