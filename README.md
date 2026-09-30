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
- This creates the `photos` table and the access rules: anyone can *view* photos, only people **signed in with Google** can *upload* one (see next section), and nobody can delete through the website itself — photos can only be removed by a grown-up directly in the Supabase dashboard (**Table Editor** → `photos`, and **Storage** → `gallery-photos`).

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

Once those two values are filled in, the Gallery page and the homepage's "Recent Photos" automatically switch to cloud mode — everyone can view photos, and signing in with Google (next section) is required to upload one.

## Turn on Google Sign-In

This site uses [Supabase Auth](https://supabase.com/docs/guides/auth) for "Sign in with Google" — it reuses the same Supabase project from above, so there's no second service to sign up for. Do this after finishing the steps above.

**1. Create a Google OAuth client**
- Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a project (or reuse one).
- Go to **APIs & Services → OAuth consent screen**. Choose **External**, fill in an app name (e.g. "Musfir's World"), your email as the support/contact email, and save. **Leave publishing status as "Testing"** — see the note below on why.
- Under the consent screen's **Audience** (or **Test users**) section, add the Google email address of every family member who should be able to sign in — Musfir's, yours, etc. Only these exact accounts will be able to complete sign-in; everyone else is blocked by Google itself before they ever reach the site.
- Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**. Application type: **Web application**.
- You'll need one URL from Supabase first: in your Supabase dashboard, go to **Authentication → Providers → Google**, and copy the **Callback URL** shown there (looks like `https://your-project-id.supabase.co/auth/v1/callback`). Paste that into **Authorized redirect URIs** on the Google Cloud form, then create the client.
- Copy the **Client ID** and **Client Secret** Google gives you.

**2. Turn on the Google provider in Supabase**
- Back in Supabase: **Authentication → Providers → Google** → paste in the Client ID and Client Secret → **Enable** → Save.

**3. Allow this site's URL to receive the sign-in redirect**
- In Supabase: **Authentication → URL Configuration → Redirect URLs**, add:
  ```
  https://symus.github.io/musfirwebsite/**
  ```
  (add `http://localhost:8080/**` too if you want Google Sign-In to work when testing locally).

That's it — every page now shows a **"Sign in with Google"** button in the top nav, which becomes a **"👋 Hi, {name}!"** greeting once signed in, with a photo and a sign-out button. Uploading a gallery photo requires being signed in.

**Why "Testing" mode matters:** while the OAuth consent screen is in Testing status, only the email addresses you explicitly added as test users can sign in at all — this is what limits the site to "Musfir + invited family" without any extra code. Moving it to "Production"/verified would open sign-in to any Google account, which isn't what we want here.

## Roadmap: AI website-builder chat agent

There's an idea on the table for a chat widget (bottom-right corner) where signed-in, approved family members could describe a website to an AI agent and have it generate and publish one — plus possibly other AI-offered services. This is intentionally **not built yet**: it's a much larger project than the rest of this site (needs its own backend, an LLM API key with cost controls, and a plan for hosting whatever it generates), and deserves its own scoping conversation before writing code. Flagging it here so it isn't lost — ask to pick this up whenever you're ready to scope it properly.
