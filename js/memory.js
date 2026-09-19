/* Memory Match: flip cards, find matching emoji pairs */

document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('memoryBoard');
  const statusEl = document.getElementById('memoryStatus');
  const resetBtn = document.getElementById('memoryReset');
  if (!boardEl) return;

  const ICONS = ['🐶', '🐱', '🐰', '🦊', '🐸', '🐼', '🦁', '🐵'];

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
    cards = shuffle([...ICONS, ...ICONS]).map((icon, i) => ({ id: i, icon }));
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
      return `<div class="memory-card ${cls}" data-id="${c.id}">${isUp ? c.icon : '❓'}</div>`;
    }).join('');
  }

  boardEl.addEventListener('click', (e) => {
    const el = e.target.closest('.memory-card');
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
      if (cards[a].icon === cards[b].icon) {
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
