/* Create page: dynamic pair rows, validation, shareable link generation */

const MAX_PAIRS = 10;
const MIN_PAIRS = 3;

const STARTER_PAIRS = [
  ['Cat', '🐱'],
  ['Dog', '🐶'],
  ['Sun', '☀️'],
  ['Moon', '🌙'],
];

document.addEventListener('DOMContentLoaded', () => {
  const rowsWrap = document.getElementById('pairRows');
  const addBtn = document.getElementById('addPairBtn');
  const createBtn = document.getElementById('createBtn');
  const titleInput = document.getElementById('gameTitle');
  const shareBox = document.getElementById('shareBox');
  const shareLinkInput = document.getElementById('shareLinkInput');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const playNowBtn = document.getElementById('playNowBtn');

  if (!rowsWrap) return;

  function addRow(a, b) {
    if (rowsWrap.children.length >= MAX_PAIRS) return;
    const row = document.createElement('div');
    row.className = 'pair-row';
    row.innerHTML = `
      <input type="text" class="pair-a" maxlength="40" placeholder="Term" value="${escapeHtml(a || '')}">
      <input type="text" class="pair-b" maxlength="40" placeholder="Match" value="${escapeHtml(b || '')}">
      <button type="button" class="pair-remove" title="Remove pair">✕</button>
    `;
    row.querySelector('.pair-remove').addEventListener('click', () => {
      row.remove();
    });
    rowsWrap.appendChild(row);
  }

  STARTER_PAIRS.forEach(([a, b]) => addRow(a, b));
  addBtn.addEventListener('click', () => addRow());

  createBtn.addEventListener('click', () => {
    const pairs = [...rowsWrap.querySelectorAll('.pair-row')]
      .map((row) => ({
        a: row.querySelector('.pair-a').value.trim(),
        b: row.querySelector('.pair-b').value.trim(),
      }))
      .filter((p) => p.a && p.b);

    if (pairs.length < MIN_PAIRS) {
      alert(`Please fill in at least ${MIN_PAIRS} pairs before creating your game!`);
      return;
    }

    const title = titleInput.value.trim() || 'My Matching Game';
    const url = buildPlayUrl({ title, pairs });

    shareLinkInput.value = url;
    playNowBtn.href = url;
    shareBox.classList.add('show');
    shareBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  copyLinkBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareLinkInput.value);
      copyLinkBtn.textContent = '✅ Copied!';
    } catch (e) {
      shareLinkInput.select();
      copyLinkBtn.textContent = '📋 Copy';
    }
    setTimeout(() => { copyLinkBtn.textContent = '📋 Copy'; }, 1500);
  });
});
