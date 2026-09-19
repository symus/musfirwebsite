/* Contact form: basic validation + friendly confirmation (no backend) */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const successPanel = document.getElementById('successPanel');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !message || !emailOk) {
      alert('Oops! Please fill in your name, a valid email, and a message.');
      return;
    }

    form.reset();
    successPanel.classList.add('show');
    successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
