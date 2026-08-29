/**
 * Supabase-nøgler. `PUBLISHABLE_KEY` er det nye navn (sb_publishable_…);
 * `ANON_KEY` beholdes som fallback for ældre projekter.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}
