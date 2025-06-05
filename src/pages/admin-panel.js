// Admin Panel page specific JS (modularized placeholder)
// Add page-specific interactivity here if needed in the future.

document.addEventListener('DOMContentLoaded', function() {
  // --- ADMIN DASHBOARD WIDGETS ---
  function updateAdminDashboardWidgets() {
    Promise.all([
      fetch('/api/users').then(r=>r.json()).then(arr=>arr.length).catch(()=>'-'),
      fetch('/api/projects').then(r=>r.json()).then(arr=>arr.length).catch(()=>'-'),
      fetch('/api/inventory').then(r=>r.json()).then(arr=>arr.length).catch(()=>'-'),
      fetch('/api/contacts').then(r=>r.json()).then(arr=>arr.length).catch(()=>'-'),
      fetch('/api/estimator/all').then(r=>r.json()).then(arr=>arr.length).catch(()=>'-'),
      fetch('/api/gallery').then(r=>r.json()).then(arr=>arr.length).catch(()=>'-')
    ]).then(([users,projects,inventory,contacts,estimator,gallery]) => {
      document.getElementById('widget-admin-users').textContent = users;
      document.getElementById('widget-admin-projects').textContent = projects;
      document.getElementById('widget-admin-inventory').textContent = inventory;
      document.getElementById('widget-admin-contacts').textContent = contacts;
      document.getElementById('widget-admin-estimator').textContent = estimator;
      document.getElementById('widget-admin-gallery').textContent = gallery;
    });
  }
  updateAdminDashboardWidgets();
  setInterval(updateAdminDashboardWidgets, 15000);

  // --- SIDEBAR NAVIGATION LOGIC (SECTION ACTIVATION) ---
  var sidebarLinks = document.querySelectorAll('.sidebar-link');
  var adminSections = document.querySelectorAll('.admin-section');
  var hero = document.getElementById('admin-hero');
  var dashboard = document.getElementById('admin-dashboard');

  function showSection(targetId) {
    let found = false;
    adminSections.forEach(function(section) {
      if (section.id === targetId) {
        section.classList.remove('d-none');
        found = true;
      } else {
        section.classList.add('d-none');
      }
    });
    if (hero && dashboard) {
      if (targetId === 'admin-dashboard') {
        hero.style.display = '';
        dashboard.style.display = '';
      } else {
        hero.style.display = 'none';
        dashboard.style.display = 'none';
      }
    }
    // Fallback: if not found, show dashboard
    if (!found && dashboard) {
      dashboard.classList.remove('d-none');
      if (hero) hero.style.display = '';
    }
  }

  sidebarLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      sidebarLinks.forEach(function(l) { l.classList.remove('active'); });
      this.classList.add('active');
      var target = this.getAttribute('data-target').replace('#','');
      showSection(target);
      var mainContent = document.querySelector('.admin-content');
      if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Show dashboard by default
  showSection('admin-dashboard');
  if (sidebarLinks[0]) sidebarLinks[0].classList.add('active');

  // Sidebar toggle (for mobile/collapsed)
  var sidebarToggle = document.querySelector('.sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.querySelector('.admin-sidebar').classList.toggle('collapsed');
    });
  }

  // --- DASHBOARD WIDGETS CLICKABLE (REVISED) ---
  var widgetMap = [
    {widget: 'widget-admin-users', link: 'users'},
    {widget: 'widget-admin-projects', link: 'projects'},
    {widget: 'widget-admin-inventory', link: 'inventory'},
    {widget: 'widget-admin-contacts', link: 'contacts'},
    {widget: 'widget-admin-estimator', link: 'estimator'},
    {widget: 'widget-admin-gallery', link: 'gallery'}
  ];
  widgetMap.forEach(function(map) {
    var el = document.getElementById(map.widget);
    if (el && el.closest('.dashboard-widget')) {
      el.closest('.dashboard-widget').addEventListener('click', function(e) {
        e.preventDefault();
        var sidebarBtn = Array.from(sidebarLinks).find(function(btn) { return btn.getAttribute('data-target') === '#' + map.link; });
        if (sidebarBtn) sidebarBtn.click();
      });
    }
  });
});
