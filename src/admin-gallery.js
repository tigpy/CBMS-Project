// Admin Gallery Management JS
// Handles loading, adding, and deleting gallery images from the admin panel

document.addEventListener('DOMContentLoaded', function() {
  const galleryTab = document.getElementById('gallery-tab');
  const galleryTable = document.getElementById('galleryTable')?.querySelector('tbody');
  const addGalleryBtn = document.getElementById('addGalleryBtn');
  const addGalleryModal = new bootstrap.Modal(document.getElementById('addGalleryModal'));
  const addGalleryForm = document.getElementById('addGalleryForm');
  const galleryUploadMsg = document.getElementById('galleryUploadMsg');

  async function loadGallery() {
    if (!galleryTable) return;
    galleryTable.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        galleryTable.innerHTML = data.map(img => `
          <tr>
            <td><img src="${img.url || img.imageUrl}" alt="" style="width:60px;height:40px;object-fit:cover;"></td>
            <td>${img.title||''}</td>
            <td>${img.category||''}</td>
            <td>${img.description||''}</td>
            <td><button class="btn btn-danger btn-sm delete-gallery-btn" data-id="${img._id}"><i class="bi bi-trash"></i></button></td>
          </tr>
        `).join('');
      } else {
        galleryTable.innerHTML = '<tr><td colspan="5">No images found.</td></tr>';
      }
    } catch (err) {
      galleryTable.innerHTML = '<tr><td colspan="5">Failed to load gallery.</td></tr>';
    }
  }

  // Open modal
  addGalleryBtn?.addEventListener('click', () => {
    addGalleryForm.reset();
    galleryUploadMsg.className = 'alert d-none';
    addGalleryModal.show();
  });

  // Add image
  addGalleryForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    galleryUploadMsg.className = 'alert d-none';
    let url = document.getElementById('galleryImageUrl').value.trim();
    const file = document.getElementById('galleryImageFile').files[0];
    const title = document.getElementById('galleryTitle').value.trim();
    const category = document.getElementById('galleryCategory').value;
    const description = document.getElementById('galleryDesc').value.trim();
    let imageUrl = url;
    if (!url && file) {
      // For demo: use FileReader to preview, but in production, upload to server/cloud
      const reader = new FileReader();
      reader.onload = async function(ev) {
        imageUrl = ev.target.result;
        await submitGalleryImage(imageUrl);
      };
      reader.readAsDataURL(file);
      return;
    }
    await submitGalleryImage(imageUrl);
    async function submitGalleryImage(imageUrl) {
      if (!imageUrl) {
        galleryUploadMsg.className = 'alert alert-danger';
        galleryUploadMsg.textContent = 'Please provide an image URL or upload a file.';
        return;
      }
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, title, category, description })
      });
      if (res.ok) {
        galleryUploadMsg.className = 'alert alert-success';
        galleryUploadMsg.textContent = 'Image added!';
        loadGallery();
        setTimeout(()=>addGalleryModal.hide(), 800);
      } else {
        galleryUploadMsg.className = 'alert alert-danger';
        galleryUploadMsg.textContent = 'Failed to add image.';
      }
    }
  });

  // Delete image
  galleryTable?.addEventListener('click', async function(e) {
    if (e.target.closest('.delete-gallery-btn')) {
      const id = e.target.closest('.delete-gallery-btn').getAttribute('data-id');
      if (confirm('Delete this image?')) {
        const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (res.ok) loadGallery();
      }
    }
  });

  // Load gallery when tab is shown
  document.getElementById('gallery-tab')?.addEventListener('shown.bs.tab', loadGallery);
  // If already active
  if (document.getElementById('gallery-tab')?.classList.contains('active')) loadGallery();
});
