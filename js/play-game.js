/* Play page: decode game data from the URL and run the matching game */

document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.getElementById('playTitle');
  const statusEl = document.getElementById('playStatus');
  const boardEl = document.getElementById('playBoard');
  const resetBtn = document.getElementById('playReset');
  const emptyEl = document.getElementById('playEmpty');
  const gameSection = boardEl ? boardEl.closest('.game-section') : null;

  if (!boardEl) return;

  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('data');
  const gameData = encoded ? decodeGameData(encoded) : null;
  const pairsValid = gameData && Array.isArray(gameData.pairs) && gameData.pairs.length >= 2;

  if (!pairsValid) {
    if (gameSection) gameSection.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }

  titleEl.textContent = `🧩 ${gameData.title || 'Matching Game'}`;
  document.title = `${gameData.title || 'Matching Game'} — Musfir's World`;

  let cards = [];
  let flipped = [];
  let matched = new Set();
  let moves = 0;
  let busy = false;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function newGame() {
    const raw = [];
    gameData.pairs.forEach((pair, pairId) => {
      raw.push({ id: raw.length, pairId, text: pair.a });
      raw.push({ id: raw.length, pairId, text: pair.b });
    });
    cards = shuffle(raw);
    flipped = [];
    matched = new Set();
    moves = 0;
    busy = false;
    statusEl.textContent = 'Moves: 0';
    render();
  }

  function render() {
    boardEl.innerHTML = cards.map((c) => {
      const isUp = flipped.includes(c.id) || matched.has(c.id);
      const cls = matched.has(c.id) ? 'matched' : (isUp ? 'flipped' : '');
      return `<div class="match-card ${cls}" data-id="${c.id}">${isUp ? escapeHtml(c.text) : '❓'}</div>`;
    }).join('');
  }

  boardEl.addEventListener('click', (e) => {
    const el = e.target.closest('.match-card');
    if (!el || busy) return;
    const id = Number(el.getAttribute('data-id'));
    if (flipped.includes(id) || matched.has(id)) return;

    flipped.push(id);
    render();

    if (flipped.length === 2) {
      moves += 1;
      statusEl.textContent = `Moves: ${moves}`;
      busy = true;
      const [a, b] = flipped;
      const cardA = cards.find((c) => c.id === a);
      const cardB = cards.find((c) => c.id === b);
      if (cardA.pairId === cardB.pairId) {
        matched.add(a);
        matched.add(b);
        flipped = [];
        busy = false;
        render();
        if (matched.size === cards.length) {
          statusEl.textContent = `You won in ${moves} moves! 🎉`;
        }
      } else {
        setTimeout(() => {
          flipped = [];
          busy = false;
          render();
        }, 700);
      }
    }
  });

  resetBtn.addEventListener('click', newGame);
  newGame();
});
