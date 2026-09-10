import type { ReactNode } from "react";

/**
 * Indhold fra Sanity skal være live uden deploy. Uden denne værdi bliver
 * Sanity-svarene lagt i Next's data-cache med et års levetid, og den cache
 * overlever deploys på serveren (`.next/cache` ryddes ikke) — så nye projekter
 * dukkede aldrig op i de statisk byggede sider. Med 60 s regenereres siderne
 * i baggrunden, og build'et henter friske data.
 */
export const revalidate = 60;

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
