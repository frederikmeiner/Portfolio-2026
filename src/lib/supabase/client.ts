import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY } from "./env";

export function getBrowserSupabase() {
  return createBrowserClient(SUPABASE_URL!, SUPABASE_KEY!);
}
