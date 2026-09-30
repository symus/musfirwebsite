/* Shared Supabase client, used by both cloud.js (gallery storage) and auth.js (sign-in). */

let _supabaseClient = null;

function cloudEnabled() {
  return typeof SUPABASE_URL === 'string' && SUPABASE_URL.length > 0 &&
    typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 0 &&
    typeof supabase !== 'undefined';
}

function getSupabaseClient() {
  if (!_supabaseClient) {
    _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabaseClient;
}
