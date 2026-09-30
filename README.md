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

- Saved builds and added servers are stored in the browser's `localStorage`, so they stay on the device they were added from and are not sent anywhere.
- Gallery photos use real cloud storage once it's configured (see below); until then they also fall back to `localStorage`.
- The contact form doesn't send email yet — wire it up to a form backend or serverless function when ready.

## Turn on real photo storage (Supabase)

By default, uploaded photos only save in the browser they were uploaded from. To make the gallery work for real — photos visible to anyone, on any device — connect it to [Supabase](https://supabase.com), a free cloud database + file storage service. This should be done by a grown-up, since it involves creating an account.

**1. Create a free Supabase project**
- Go to [supabase.com](https://supabase.com) and sign up.
- Click **New project**, give it any name, pick a region, and wait ~1 minute for it to spin up.

**2. Create the photo storage bucket**
- In the left sidebar, go to **Storage** → **New bucket**.
- Name it exactly `gallery-photos` and toggle **Public bucket** on. Save.

**3. Run the database setup script**
- In the left sidebar, go to **SQL Editor** → **New query**.
- Open [`supabase/schema.sql`](supabase/schema.sql) from this repo, paste its contents in, and click **Run**.
- This creates the `photos` table and the access rules: anyone can view and upload photos (no login system exists on the site), but nobody can delete through the website itself — photos can only be removed by a grown-up directly in the Supabase dashboard (**Table Editor** → `photos`, and **Storage** → `gallery-photos`).

**4. Copy your project's API keys**
- Go to **Project Settings** (gear icon) → **API**.
- Copy the **Project URL** and the **anon public** key. These are safe to use in public front-end code — they are not secret passwords.

**5. Add the keys to the site**
- Open [`js/supabase-config.js`](js/supabase-config.js) and fill in:
  ```js
  const SUPABASE_URL = 'https://your-project-id.supabase.co';
  const SUPABASE_ANON_KEY = 'your-anon-public-key';
  ```
- Commit and push (or edit the file directly on GitHub and commit there).

Once those two values are filled in, the Gallery page and the homepage's "Recent Photos" automatically switch to cloud mode — new uploads are stored in Supabase and visible to every visitor.

**Heads up:** because the site has no login system, anyone who visits the gallery can upload a photo (not delete — see step 3). If that's a concern, the next step would be adding a simple login/password gate before uploads are allowed — ask if you'd like that built too.
