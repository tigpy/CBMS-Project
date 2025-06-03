// Admin Panel JS for Estimator Tab
async function loadEstimatorSubmissions() {
  const table = document.getElementById('estimatorTable').querySelector('tbody');
  table.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
  try {
    const res = await fetch('http://localhost:5000/api/estimator/all');
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      table.innerHTML = data.map(e => `
        <tr>
          <td>${e.projectName}</td>
          <td>${e.projectType}</td>
          <td>${e.area}</td>
          <td>${e.budget ? '₹'+e.budget.toLocaleString() : '-'}</td>
          <td>₹${e.estimatedCost.toLocaleString()}</td>
          <td>${e.estimatedDuration} month(s)</td>
          <td>${new Date(e.createdAt).toLocaleString()}</td>
        </tr>
      `).join('');
    } else {
      table.innerHTML = '<tr><td colspan="7">No submissions found.</td></tr>';
    }
  } catch (err) {
    table.innerHTML = '<tr><td colspan="7">Failed to load data.</td></tr>';
  }
}
// Load on tab show
const estimatorTab = document.getElementById('estimator-tab');
if (estimatorTab) {
  estimatorTab.addEventListener('shown.bs.tab', loadEstimatorSubmissions);
  // If the estimator tab is already active on page load, load data immediately
  if (estimatorTab.classList.contains('active')) {
    loadEstimatorSubmissions();
  }
}
