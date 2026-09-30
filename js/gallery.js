/* Gallery page: render grid, handle uploads, lightbox. Uses Supabase
   cloud storage when configured (see js/supabase-config.js), otherwise
   falls back to this browser's localStorage. */

const GALLERY_KEY = 'musfir_gallery_photos';

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('galleryGrid');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightboxMedia');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxClose = document.getElementById('lightboxClose');
  const cloudStatus = document.getElementById('cloudStatus');

  if (!grid) return;

  const usingCloud = cloudEnabled();
  let photos = [];
  let currentUser = null;

  if (usingCloud) {
    cloudStatus.textContent = '☁️ Photos are saved online for everyone to see. Sign in with Google (top of the page) to upload your own!';
    photos = await fetchCloudPhotos();

    const client = getSupabaseClient();
    const { data } = await client.auth.getSession();
    currentUser = data.session ? data.session.user : null;
    client.auth.onAuthStateChange((_event, session) => {
      currentUser = session ? session.user : null;
    });
  } else {
    cloudStatus.textContent = '💻 Cloud storage isn\'t set up yet, so photos only save on this device. Ask a grown-up to check the README!';
    photos = loadList(GALLERY_KEY, SEED_PHOTOS);
  }

  function blockedBySignIn() {
    if (usingCloud && !currentUser) {
      alert('Please sign in with Google at the top of the page before uploading a photo! 🔑');
      return true;
    }
    return false;
  }

  function render() {
    if (!photos.length) {
      grid.innerHTML = '<p class="empty-state">No photos yet — upload one above! 📷</p>';
      return;
    }
    grid.innerHTML = photos.slice().reverse().map((p) => `
      <div class="card" data-id="${p.id}">
        ${p.src
          ? `<div class="card-media" style="cursor:pointer" data-open="${p.id}"><img src="${p.src}" alt="${escapeHtml(p.title)}"></div>`
          : `<div class="card-media" style="background:${p.color}; cursor:pointer" data-open="${p.id}">${p.emoji}</div>`}
        <div class="card-body">
          <h3>${escapeHtml(p.title)}</h3>
          <span class="card-meta">${p.date}</span>
          ${usingCloud ? '' : `
          <div class="card-actions">
            <button class="btn btn-danger btn-sm" data-delete="${p.id}">🗑️ Delete</button>
          </div>`}
        </div>
      </div>
    `).join('');
  }

  function openLightbox(id) {
    const p = photos.find((x) => x.id === id);
    if (!p) return;
    lightboxMedia.innerHTML = p.src
      ? `<img src="${p.src}" alt="${escapeHtml(p.title)}">`
      : '';
    if (!p.src) {
      lightboxMedia.style.background = p.color;
      lightboxMedia.textContent = p.emoji;
    } else {
      lightboxMedia.style.background = '#000';
    }
    lightboxTitle.textContent = p.title;
    lightboxDate.textContent = p.date;
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  grid.addEventListener('click', (e) => {
    const openId = e.target.closest('[data-open]');
    const delId = e.target.closest('[data-delete]');
    if (delId) {
      const id = delId.getAttribute('data-delete');
      photos = photos.filter((p) => p.id !== id);
      saveList(GALLERY_KEY, photos);
      render();
      return;
    }
    if (openId) {
      openLightbox(openId.getAttribute('data-open'));
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  async function handleFiles(files) {
    for (const file of [...files]) {
      if (!file.type.startsWith('image/')) continue;
      const title = file.name.replace(/\.[^/.]+$/, '') || 'My Photo';

      if (usingCloud) {
        try {
          const photo = await uploadCloudPhoto(file, title);
          photos.push(photo);
          render();
        } catch (err) {
          alert('Oops, that photo could not be uploaded: ' + err.message);
        }
        continue;
      }

      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          photos.push({
            id: uid(),
            title,
            date: todayStr(),
            emoji: '📷',
            color: randomColor(),
            src: e.target.result,
          });
          saveList(GALLERY_KEY, photos);
          render();
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  dropzone.addEventListener('click', () => {
    if (blockedBySignIn()) return;
    fileInput.click();
  });
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (blockedBySignIn()) return;
      fileInput.click();
    }
  });
  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  ['dragenter', 'dragover'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', (e) => {
    if (blockedBySignIn()) return;
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  });

  render();
});
