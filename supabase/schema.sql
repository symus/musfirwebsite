-- Musfir's World — Gallery cloud storage setup
--
-- Run this once in your Supabase project's SQL Editor
-- (left sidebar → SQL Editor → New query → paste this → Run).
--
-- Before running this, first create a Storage bucket named
-- "gallery-photos" and set it to Public (Storage → New bucket →
-- name "gallery-photos" → toggle "Public bucket" on → Save).
--
-- If you already ran an earlier version of this script (before
-- Google Sign-In existed) and just want to require sign-in for
-- uploads, you only need to run the two "drop policy" + "create
-- policy ... to authenticated" blocks below — the rest is a no-op
-- thanks to "if not exists".

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'My Photo',
  photo_date date not null default current_date,
  path text not null,
  created_at timestamptz not null default now()
);

alter table photos enable row level security;

-- Anyone can view the photo list (needed so the gallery page can load,
-- even for visitors who haven't signed in).
drop policy if exists "Public can view photos" on photos;
create policy "Public can view photos"
  on photos for select
  using (true);

-- Only signed-in (Google) users can add a new photo.
drop policy if exists "Public can upload photos" on photos;
drop policy if exists "Signed-in users can upload photos" on photos;
create policy "Signed-in users can upload photos"
  on photos for insert
  to authenticated
  with check (true);

-- No update/delete policy is created on purpose: even with sign-in,
-- allowing delete would let any signed-in visitor wipe out the whole
-- gallery. To remove a photo, delete its row here (Table Editor →
-- photos) and its file in Storage → gallery-photos.

-- Storage policies: public read, upload requires sign-in (same
-- reasoning as above — no delete).
drop policy if exists "Public can view gallery files" on storage.objects;
create policy "Public can view gallery files"
  on storage.objects for select
  using (bucket_id = 'gallery-photos');

drop policy if exists "Public can upload gallery files" on storage.objects;
drop policy if exists "Signed-in users can upload gallery files" on storage.objects;
create policy "Signed-in users can upload gallery files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery-photos');
