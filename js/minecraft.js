/* Minecraft Corner: block builder canvas, favorite servers, builds showcase */

document.addEventListener('DOMContentLoaded', () => {
  initBuilder();
  initServers();
  initBuilds();
});

const BLOCKS = [
  { id: 'grass', color: '#6bcb77', label: 'Grass' },
  { id: 'dirt', color: '#a0653a', label: 'Dirt' },
  { id: 'stone', color: '#9e9e9e', label: 'Stone' },
  { id: 'wood', color: '#8b5a2b', label: 'Wood' },
  { id: 'water', color: '#4d96ff', label: 'Water' },
  { id: 'eraser', color: '#cdeafe', label: 'Eraser' },
];

function initBuilder() {
  const canvas = document.getElementById('builderCanvas');
  const paletteEl = document.getElementById('palette');
  const clearBtn = document.getElementById('builderClear');
  const saveBtn = document.getElementById('builderSave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const cell = 16;
  const cols = canvas.width / cell;
  const rows = canvas.height / cell;
  let grid = Array(cols * rows).fill(null);
  let selected = BLOCKS[0];
  let painting = false;

  paletteEl.innerHTML = BLOCKS.map((b, i) => `
    <button data-i="${i}" title="${b.label}" style="background:${b.color}" class="${i === 0 ? 'selected' : ''}"></button>
  `).join('');

  paletteEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    selected = BLOCKS[Number(btn.getAttribute('data-i'))];
    paletteEl.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
  });

  function draw() {
    ctx.fillStyle = '#cdeafe';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    grid.forEach((color, idx) => {
      if (!color) return;
      const x = (idx % cols) * cell;
      const y = Math.floor(idx / cols) * cell;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cell, cell);
    });
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * cell);
      ctx.lineTo(canvas.width, j * cell);
      ctx.stroke();
    }
  }

  function paintAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((clientX - rect.left) * scaleX / cell);
    const y = Math.floor((clientY - rect.top) * scaleY / cell);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    const idx = y * cols + x;
    grid[idx] = selected.id === 'eraser' ? null : selected.color;
    draw();
  }

  canvas.addEventListener('mousedown', (e) => {
    painting = true;
    paintAt(e.clientX, e.clientY);
  });
  canvas.addEventListener('mousemove', (e) => {
    if (painting) paintAt(e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', () => { painting = false; });

  canvas.addEventListener('touchstart', (e) => {
    painting = true;
    const t = e.touches[0];
    paintAt(t.clientX, t.clientY);
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    paintAt(t.clientX, t.clientY);
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { painting = false; });

  clearBtn.addEventListener('click', () => {
    grid = Array(cols * rows).fill(null);
    draw();
  });

  saveBtn.addEventListener('click', () => {
    const title = prompt('Name your build:', 'My Build') || 'My Build';
    const builds = loadList('musfir_builds', SEED_BUILDS);
    builds.push({ id: uid(), title, date: todayStr(), src: canvas.toDataURL('image/png') });
    saveList('musfir_builds', builds);
    renderBuilds();
    alert('Build saved to the showcase below! 🏆');
  });

  draw();
}

const SEED_SERVERS = [
  { id: 's1', name: 'Blocky Adventures', address: 'play.example.com', note: 'Fun mini-games with friends' },
  { id: 's2', name: 'Creative Kingdom', address: 'creative.example.com', note: 'Great for building big castles' },
];

function initServers() {
  const grid = document.getElementById('serverGrid');
  const form = document.getElementById('serverForm');
  if (!grid) return;

  let servers = loadList('musfir_servers', SEED_SERVERS);

  function render() {
    if (!servers.length) {
      grid.innerHTML = '<p class="empty-state">No servers added yet!</p>';
      return;
    }
    grid.innerHTML = servers.map((s) => `
      <div class="card">
        <div class="card-media" style="background:#9b5de5;">🖥️</div>
        <div class="card-body">
          <h3>${escapeHtml(s.name)}</h3>
          <span class="card-meta">${escapeHtml(s.address)}</span>
          <p style="margin:4px 0 0; font-size:0.9rem;">${escapeHtml(s.note || '')}</p>
          <div class="card-actions">
            <button class="btn btn-danger btn-sm" data-del="${s.id}">🗑️ Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    servers = servers.filter((s) => s.id !== btn.getAttribute('data-del'));
    saveList('musfir_servers', servers);
    render();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('serverName').value.trim();
    const address = document.getElementById('serverAddress').value.trim();
    const note = document.getElementById('serverNote').value.trim();
    if (!name || !address) return;
    servers.push({ id: uid(), name, address, note });
    saveList('musfir_servers', servers);
    form.reset();
    render();
  });

  render();
}

const SEED_BUILDS = [];

function renderBuilds() {
  const grid = document.getElementById('buildsGrid');
  if (!grid) return;
  const builds = loadList('musfir_builds', SEED_BUILDS);
  if (!builds.length) {
    grid.innerHTML = '<p class="empty-state">No builds saved yet — make one above! 🧱</p>';
    return;
  }
  grid.innerHTML = builds.slice().reverse().map((b) => `
    <div class="card">
      <div class="card-media"><img src="${b.src}" alt="${escapeHtml(b.title)}"></div>
      <div class="card-body">
        <h3>${escapeHtml(b.title)}</h3>
        <span class="card-meta">${b.date}</span>
        <div class="card-actions">
          <button class="btn btn-danger btn-sm" data-del="${b.id}">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function initBuilds() {
  const grid = document.getElementById('buildsGrid');
  if (!grid) return;
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    let builds = loadList('musfir_builds', SEED_BUILDS);
    builds = builds.filter((b) => b.id !== btn.getAttribute('data-del'));
    saveList('musfir_builds', builds);
    renderBuilds();
  });
  renderBuilds();
}
