-- Musfir's World — Gallery cloud storage setup
--
-- Run this once in your Supabase project's SQL Editor
-- (left sidebar → SQL Editor → New query → paste this → Run).
--
-- Before running this, first create a Storage bucket named
-- "gallery-photos" and set it to Public (Storage → New bucket →
-- name "gallery-photos" → toggle "Public bucket" on → Save).

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'My Photo',
  photo_date date not null default current_date,
  path text not null,
  created_at timestamptz not null default now()
);

alter table photos enable row level security;

-- Anyone can view the photo list (needed so the gallery page can load).
create policy "Public can view photos"
  on photos for select
  using (true);

-- Anyone can add a new photo (no login system exists on this site yet).
create policy "Public can upload photos"
  on photos for insert
  with check (true);

-- No update/delete policy is created on purpose: without a login
-- system, allowing public delete would let any visitor wipe out the
-- whole gallery. To remove a photo, delete its row here (Table
-- Editor → photos) and its file in Storage → gallery-photos.

-- Storage policies: allow public read + upload on the gallery-photos
-- bucket (same reasoning as above — no delete).
create policy "Public can view gallery files"
  on storage.objects for select
  using (bucket_id = 'gallery-photos');

create policy "Public can upload gallery files"
  on storage.objects for insert
  with check (bucket_id = 'gallery-photos');
