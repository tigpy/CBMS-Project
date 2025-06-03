// Main site-wide JS for CBMS
// Gallery Section Logic
let galleryImages = [];
let currentGalleryIndex = 0;
fetch('http://localhost:5000/api/gallery')
  .then(res => res.json())
  .then(images => {
    images.forEach(img => img.featured = Math.random() < 0.25);
    galleryImages = images;
    renderGallery('All');
  });
function renderGallery(category) {
  const grid = document.getElementById('gallery-grid');
  let filtered = category==='All' ? galleryImages : galleryImages.filter(img => img.category===category);
  grid.innerHTML = filtered.map((img, idx) => {
    // Choose icon based on category
    let typeIcon = 'bi bi-house';
    if (img.category === 'Commercial') typeIcon = 'bi bi-building';
    else if (img.category === 'Renovation') typeIcon = 'bi bi-brush';
    else if (img.category === 'Residential') typeIcon = 'bi bi-house-door';
    return `
      <div class='col-6 col-md-4 col-lg-3 d-flex align-items-stretch'>
        <div class='gallery-card w-100 h-100 position-relative' data-idx='${galleryImages.indexOf(img)}'>
          <img src='${img.url || img.imageUrl}' class='gallery-img' alt='${img.title||"Project"}'>
          <span class="gallery-fav"><i class="bi bi-heart"></i></span>
          <div class='gallery-overlay'>
            <span class="gallery-type-icon ${typeIcon}"></span>
            <div class='gallery-title'>${img.title||''}</div>
            <button class='gallery-view-btn'>View Details</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  // Animate fade-in
  grid.querySelectorAll('.gallery-card').forEach((card, i) => {
    setTimeout(() => card.classList.add('animated'), 120 + i * 90);
  });
  // Image load fade-in
  grid.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('load',()=>img.classList.add('loaded'));
  });
}
// Filter buttons
const galleryFilters = document.getElementById('gallery-filters');
galleryFilters.addEventListener('click', function(e) {
  const btn = e.target.closest('button[data-filter]');
  if (btn) {
    this.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.getAttribute('data-filter'));
  }
});
// Card click events
const galleryGrid = document.getElementById('gallery-grid');
galleryGrid.addEventListener('click', function(e) {
  const card = e.target.closest('.gallery-card');
  if (!card) return;
  let idx = +card.getAttribute('data-idx');
  if (e.target.classList.contains('gallery-view-btn') || e.target.classList.contains('gallery-img')) {
    openGalleryModal(idx);
  }
  // Favorite icon
  if (e.target.classList.contains('gallery-fav') || e.target.closest('.gallery-fav')) {
    const fav = e.target.classList.contains('gallery-fav') ? e.target : e.target.closest('.gallery-fav');
    fav.classList.toggle('favorited');
    if (fav.classList.contains('favorited') && window.confetti) {
      const rect = fav.getBoundingClientRect();
      confetti({
        particleCount: 32,
        spread: 60,
        origin: {
          x: (rect.left + rect.width/2) / window.innerWidth,
          y: (rect.top + rect.height/2) / window.innerHeight
        },
        colors: ['#ff416c','#ff4b2b','#007cf0','#00dfd8']
      });
    }
  }
});
function openGalleryModal(idx) {
  currentGalleryIndex = idx;
  const img = galleryImages[idx];
  document.getElementById('galleryModalImg').src = img.url;
  document.getElementById('galleryModalTitle').textContent = img.title || 'Project';
  document.getElementById('galleryModalDesc').textContent = img.description || '';
  let modal = new bootstrap.Modal(document.getElementById('galleryModal'));
  modal.show();
}
document.getElementById('galleryPrevBtn').onclick = function() {
  currentGalleryIndex = (currentGalleryIndex-1+galleryImages.length)%galleryImages.length;
  openGalleryModal(currentGalleryIndex);
};
document.getElementById('galleryNextBtn').onclick = function() {
  currentGalleryIndex = (currentGalleryIndex+1)%galleryImages.length;
  openGalleryModal(currentGalleryIndex);
};
// Smooth Scroll
if (document.querySelectorAll('a.nav-link').length) {
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
// Modal-backdrop and modal-open robust fix
function cleanModals() {
  document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
  });
  document.body.classList.remove('modal-open');
  document.body.style = '';
}
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  modals.forEach(function(modal) {
    modal.addEventListener('hidden.bs.modal', cleanModals);
    modal.addEventListener('show.bs.modal', cleanModals);
  });
  document.body.addEventListener('click', cleanModals, true);
});
// Modal logic for service cards
// This will open a Bootstrap modal if the button has data-bs-toggle="modal" and data-bs-target="#modalId"
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.service-card [data-bs-toggle="modal"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const target = this.getAttribute('data-bs-target');
      if (target && document.querySelector(target)) {
        const modal = new bootstrap.Modal(document.querySelector(target));
        modal.show();
      }
    });
  });
});
