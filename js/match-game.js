/* Shared encode/decode for custom matching-game data, carried entirely in the URL
   (no backend/login needed — the link itself is the save file). */

function encodeGameData(data) {
  const json = JSON.stringify(data);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeGameData(encoded) {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function buildPlayUrl(data) {
  const url = new URL('play.html', window.location.href);
  url.searchParams.set('data', encodeGameData(data));
  return url.toString();
}
