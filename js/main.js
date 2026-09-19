/* Shared behavior: nav toggle, footer year, home page previews */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  document.querySelectorAll('.footer-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  renderFeaturedPhotos();
  renderFeaturedGames();
});

function mediaHtml(item) {
  if (item.src) {
    return `<img src="${item.src}" alt="${escapeHtml(item.title)}">`;
  }
  return `<div class="card-media" style="background:${item.color}">${item.emoji}</div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderFeaturedPhotos() {
  const wrap = document.getElementById('featuredPhotos');
  if (!wrap) return;
  const photos = loadList('musfir_gallery_photos', SEED_PHOTOS).slice(-4).reverse();
  wrap.innerHTML = photos.map((p) => `
    <div class="card">
      ${p.src ? `<div class="card-media"><img src="${p.src}" alt="${escapeHtml(p.title)}"></div>` : `<div class="card-media" style="background:${p.color}">${p.emoji}</div>`}
      <div class="card-body">
        <h3>${escapeHtml(p.title)}</h3>
        <span class="card-meta">${p.date}</span>
      </div>
    </div>
  `).join('');
}

function renderFeaturedGames() {
  const wrap = document.getElementById('featuredGames');
  if (!wrap) return;
  wrap.innerHTML = GAMES_LIST.map((g) => `
    <a class="card icon-card" href="${g.href}">
      <div class="card-media" style="background:${g.color}">${g.emoji}</div>
      <div class="card-body">
        <h3>${g.title}</h3>
        <span class="card-meta">${g.desc}</span>
      </div>
    </a>
  `).join('');
}
