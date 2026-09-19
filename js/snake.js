/* Snake: canvas game with keyboard, WASD and touch controls */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('snakeCanvas');
  const statusEl = document.getElementById('snakeStatus');
  const resetBtn = document.getElementById('snakeReset');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const grid = 16;
  const cols = canvas.width / grid;
  const rows = canvas.height / grid;

  let snake, dir, nextDir, food, score, loopId, running;

  function reset() {
    snake = [{ x: 8, y: 8 }];
    dir = { x: 1, y: 0 };
    nextDir = dir;
    score = 0;
    running = true;
    placeFood();
    statusEl.textContent = 'Score: 0';
    if (loopId) clearInterval(loopId);
    loopId = setInterval(tick, 120);
    draw();
  }

  function placeFood() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function tick() {
    if (!running) return;
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows || snake.some((s) => s.x === head.x && s.y === head.y)) {
      running = false;
      clearInterval(loopId);
      statusEl.textContent = `Game over! Score: ${score} — press Start to try again 🐍`;
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      statusEl.textContent = `Score: ${score}`;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function draw() {
    ctx.fillStyle = '#1b1f3b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x * grid + 2, food.y * grid + 2, grid - 4, grid - 4);

    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#ffd93d' : '#6bcb77';
      ctx.fillRect(s.x * grid + 1, s.y * grid + 1, grid - 2, grid - 2);
    });
  }

  function setDir(x, y) {
    if (dir.x === -x && dir.y === -y) return;
    nextDir = { x, y };
  }

  document.addEventListener('keydown', (e) => {
    const map = {
      ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
      ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
      ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
      ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
    };
    if (map[e.key]) {
      e.preventDefault();
      setDir(...map[e.key]);
    }
  });

  document.querySelectorAll('.touch-controls button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = btn.getAttribute('data-dir');
      const map = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
      setDir(...map[d]);
    });
  });

  resetBtn.addEventListener('click', reset);
  reset();
  running = false;
  clearInterval(loopId);
  statusEl.textContent = 'Press Start / Restart to play!';
  draw();
});
