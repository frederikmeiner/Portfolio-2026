/**
 * Teknologinavn → URL-venlig nøgle: "Next.js" → "next-js", "C#" → "c".
 * Bruges i ?tech= på projektoversigten, så links fra kompetencer og
 * projektsider rammer samme filter. Ren funktion — kører også i `node --test`.
 */
export function techSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TechCount = { slug: string; name: string; count: number };

/** Hvor mange projekter bruger hver teknologi — mest brugte først, derefter alfabetisk. */
export function countTechnologies(projects: { technologies?: { name: string }[] }[]): TechCount[] {
  const counts = new Map<string, TechCount>();
  for (const project of projects) {
    for (const tech of project.technologies ?? []) {
      const slug = techSlug(tech.name);
      if (!slug) continue;
      const hit = counts.get(slug);
      if (hit) hit.count += 1;
      else counts.set(slug, { slug, name: tech.name, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "da"));
}
