/* Tic-Tac-Toe: two players take turns on the same device */

document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('tttBoard');
  const status = document.getElementById('tttStatus');
  const resetBtn = document.getElementById('tttReset');
  if (!board) return;

  const WINS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  let cells = Array(9).fill(null);
  let current = 'X';
  let over = false;

  function render() {
    board.innerHTML = cells.map((v, i) => `<button class="ttt-cell" data-i="${i}">${v || ''}</button>`).join('');
  }

  function checkWinner() {
    for (const [a, b, c] of WINS) {
      if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) return cells[a];
    }
    if (cells.every(Boolean)) return 'draw';
    return null;
  }

  board.addEventListener('click', (e) => {
    const btn = e.target.closest('.ttt-cell');
    if (!btn || over) return;
    const i = Number(btn.getAttribute('data-i'));
    if (cells[i]) return;
    cells[i] = current;
    const winner = checkWinner();
    if (winner === 'draw') {
      status.textContent = "It's a draw! 🤝";
      over = true;
    } else if (winner) {
      status.textContent = `Player ${winner} wins! 🎉`;
      over = true;
    } else {
      current = current === 'X' ? 'O' : 'X';
      status.textContent = `Player ${current}'s turn`;
    }
    render();
  });

  resetBtn.addEventListener('click', () => {
    cells = Array(9).fill(null);
    current = 'X';
    over = false;
    status.textContent = "Player X's turn";
    render();
  });

  render();
});
