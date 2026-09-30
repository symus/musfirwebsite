/* Optional cloud photo storage (Supabase). Falls back gracefully when not configured. */

const GALLERY_BUCKET = 'gallery-photos';
const GALLERY_TABLE = 'photos';
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

let _supabaseClient = null;

function cloudEnabled() {
  return typeof SUPABASE_URL === 'string' && SUPABASE_URL.length > 0 &&
    typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 0 &&
    typeof supabase !== 'undefined';
}

function getCloudClient() {
  if (!_supabaseClient) {
    _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabaseClient;
}

function publicPhotoUrl(client, path) {
  return client.storage.from(GALLERY_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function fetchCloudPhotos() {
  const client = getCloudClient();
  const { data, error } = await client
    .from(GALLERY_TABLE)
    .select('id, title, photo_date, path, created_at')
    .order('created_at', { ascending: true });
  if (error) {
    console.warn('Could not load cloud photos:', error.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    date: row.photo_date,
    src: publicPhotoUrl(client, row.path),
  }));
}

async function uploadCloudPhoto(file, title) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('That photo is too big (max 8MB).');
  }
  const client = getCloudClient();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await client.storage
    .from(GALLERY_BUCKET)
    .upload(path, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  const { data, error: insertError } = await client
    .from(GALLERY_TABLE)
    .insert({ title, photo_date: todayStr(), path })
    .select()
    .single();
  if (insertError) throw insertError;

  return {
    id: data.id,
    title: data.title,
    date: data.photo_date,
    src: publicPhotoUrl(client, data.path),
  };
}
