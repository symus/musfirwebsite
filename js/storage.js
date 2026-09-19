/* Small localStorage helpers shared across pages */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadList(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read', key, e);
  }
  saveList(key, seed);
  return seed.slice();
}

function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save', key, e);
  }
}

const PALETTE = ['#ff6b6b', '#ff9f43', '#ffd93d', '#6bcb77', '#4d96ff', '#9b5de5', '#ff70a6'];

function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

const SEED_PHOTOS = [
  { id: 'p1', title: 'Beach Day', date: '2026-08-02', emoji: '🏖️', color: '#4d96ff', src: null },
  { id: 'p2', title: 'Birthday Cake', date: '2026-07-14', emoji: '🎂', color: '#ff70a6', src: null },
  { id: 'p3', title: 'My Robot Drawing', date: '2026-06-30', emoji: '🤖', color: '#9b5de5', src: null },
  { id: 'p4', title: 'Camping Trip', date: '2026-06-10', emoji: '🏕️', color: '#6bcb77', src: null },
  { id: 'p5', title: 'Soccer Game', date: '2026-05-22', emoji: '⚽', color: '#ff9f43', src: null },
  { id: 'p6', title: 'Snow Day', date: '2026-01-15', emoji: '⛄', color: '#4d96ff', src: null },
];

const GAMES_LIST = [
  { id: 'tictactoe', title: 'Tic-Tac-Toe', emoji: '⭕', desc: 'Classic X\'s and O\'s', href: 'games.html#tictactoe', color: '#ff6b6b' },
  { id: 'memory', title: 'Memory Match', emoji: '🧠', desc: 'Find the matching pairs', href: 'games.html#memory', color: '#ffd93d' },
  { id: 'snake', title: 'Snake', emoji: '🐍', desc: 'Eat, grow, don\'t crash!', href: 'games.html#snake', color: '#6bcb77' },
  { id: 'minecraft', title: 'Minecraft Corner', emoji: '🧱', desc: 'Build, servers & showcase', href: 'minecraft.html', color: '#9b5de5' },
];
