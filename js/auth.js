/* Google Sign-In via Supabase Auth. Shows a greeting in the nav when signed in. */

document.addEventListener('DOMContentLoaded', () => {
  const authItem = document.getElementById('authItem');
  if (!authItem) return;

  if (!cloudEnabled()) {
    authItem.innerHTML = '';
    return;
  }

  const client = getSupabaseClient();

  function renderSignedOut() {
    authItem.innerHTML = '<button class="btn btn-accent btn-sm" id="googleSignInBtn">🔑 Sign in with Google</button>';
    document.getElementById('googleSignInBtn').addEventListener('click', () => {
      client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href },
      });
    });
  }

  function renderSignedIn(user) {
    const meta = user.user_metadata || {};
    const fullName = meta.full_name || meta.name || user.email || 'friend';
    const firstName = fullName.split(' ')[0];
    const avatar = meta.avatar_url || meta.picture;
    authItem.innerHTML = `
      <span class="auth-greeting">
        ${avatar ? `<img class="auth-avatar" src="${avatar}" alt="">` : ''}
        👋 Hi, ${escapeHtml(firstName)}!
      </span>
      <button class="btn btn-outline btn-sm" id="signOutBtn">Sign out</button>
    `;
    document.getElementById('signOutBtn').addEventListener('click', () => client.auth.signOut());
  }

  client.auth.getSession().then(({ data }) => {
    if (data.session) renderSignedIn(data.session.user);
    else renderSignedOut();
  });

  client.auth.onAuthStateChange((_event, session) => {
    if (session) renderSignedIn(session.user);
    else renderSignedOut();
  });
});
