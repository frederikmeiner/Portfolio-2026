/**
 * "Mere som dette": de projekter, der deler flest teknologier med det aktuelle.
 * Ren funktion — kører også i `node --test`.
 */
export type ProjectLike = {
  _id: string;
  featured?: boolean;
  publishedAt?: string;
  technologies?: { _id: string }[];
};

export function relatedProjects<T extends ProjectLike>(current: T, all: T[], limit = 6): T[] {
  const mine = new Set((current.technologies ?? []).map((t) => t._id));
  if (mine.size === 0) return [];

  return all
    .filter((p) => p._id !== current._id)
    .map((p) => ({ p, shared: (p.technologies ?? []).filter((t) => mine.has(t._id)).length }))
    .filter((x) => x.shared > 0)
    .sort(
      (x, y) =>
        y.shared - x.shared ||
        Number(Boolean(y.p.featured)) - Number(Boolean(x.p.featured)) ||
        (y.p.publishedAt ?? "").localeCompare(x.p.publishedAt ?? "")
    )
    .slice(0, limit)
    .map((x) => x.p);
}
