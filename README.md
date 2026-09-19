# Musfir's World 🚀

A fun, colorful personal website built with plain HTML, CSS and JavaScript — no build step required.

## Pages

- **Home** (`index.html`) — hero banner with quick links, plus previews of recent photos and top games.
- **Gallery** (`gallery.html`) — photo grid with drag-and-drop / click-to-upload, and a full-screen lightbox viewer.
- **Games** (`games.html`) — Tic-Tac-Toe, Memory Match, and Snake, all playable with mouse, keyboard, or touch.
- **Minecraft Corner** (`minecraft.html`) — a block-building canvas toy, a favorite-servers list, and a builds showcase gallery.
- **Contact** (`contact.html`) — a kid-safe contact form with friendly on-submit feedback.

## Running locally

No build tools needed — just serve the folder statically, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Notes

- Uploaded photos, saved builds, and added servers are stored in the browser's `localStorage`, so they stay on the device they were added from and are not sent anywhere.
- The contact form doesn't send email yet — wire it up to a form backend or serverless function when ready.
