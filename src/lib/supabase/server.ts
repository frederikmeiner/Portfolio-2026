import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY } from "./env";

export { isSupabaseConfigured } from "./env";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Kaldt fra en Server Component — proxy'en refresher sessionen i stedet.
        }
      },
    },
  });
}
