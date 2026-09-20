import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY, isSupabaseConfigured } from "@/lib/supabase/env";
import type { Project } from "@/lib/sanity/queries";

export const TOP_LIMIT = 10;
/** Under dette antal sete projekter er tallene for tynde til at kalde det en rangliste. */
const MIN_RANKED = 3;

/**
 * De mest sete slugs, mest sete først. Tom liste hvis Supabase ikke er sat op,
 * funktionen mangler eller kaldet fejler — forsiden må aldrig vælte på dette.
 *
 * Uden cookies med vilje: forsiderne er statiske, og en session-klient ville
 * gøre dem dynamiske. `get: true` giver et GET-kald, som Next kan cache.
 */
async function getTopSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, { auth: { persistSession: false } });
    const { data, error } = await supabase.rpc("top_project_slugs", { p_limit: 50 }, { get: true });
    if (error || !Array.isArray(data)) return [];
    return data.map((row: { slug: string }) => row.slug);
  } catch {
    return [];
  }
}

/**
 * Top 10 ud fra rigtige visninger. Pladser uden tal fyldes op i Sanity-rækkefølgen,
 * så rækken er fuld fra dag ét. `ranked` fortæller, om toppen faktisk er målt.
 */
export async function getTopProjects(projects: Project[]): Promise<{ projects: Project[]; ranked: boolean }> {
  const bySlug = new Map(projects.map((p) => [p.slug.current, p]));
  // Slugs fra tabellen kan være omdøbt eller slettet i Sanity siden.
  const seen = (await getTopSlugs()).flatMap((slug) => bySlug.get(slug) ?? []);
  const rest = projects.filter((p) => !seen.includes(p));
  return { projects: [...seen, ...rest].slice(0, TOP_LIMIT), ranked: seen.length >= MIN_RANKED };
}
