/**
 * Continue Watching: hvad denne besøgende har åbnet, og hvor langt ned de kom.
 * Rene funktioner over en liste, plus tynde læs/skriv-hjælpere til localStorage.
 * Alt browser-adgang er i try/catch — private vinduer og blokeret storage kaster.
 */
export type WatchEntry = {
  href: string;
  title: string;
  image?: string;
  /** 0..1 — hvor langt ned på siden man nåede. */
  progress: number;
  /** Date.now() for seneste besøg. */
  at: number;
};

export const WATCH_LIMIT = 8;

const clamp = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

/** Upsert på href: nyeste forrest, progress kun opad, aldrig flere end WATCH_LIMIT. */
export function recordVisit(list: WatchEntry[], entry: WatchEntry): WatchEntry[] {
  const prev = list.find((e) => e.href === entry.href);
  const merged: WatchEntry = { ...entry, progress: clamp(Math.max(prev?.progress ?? 0, entry.progress)) };
  return [merged, ...list.filter((e) => e.href !== entry.href)].slice(0, WATCH_LIMIT);
}

export function storageKey(profile: string) {
  return `watch:${profile}`;
}

export function readHistory(profile: string): WatchEntry[] {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(profile));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as WatchEntry[]).filter((e) => typeof e?.href === "string") : [];
  } catch {
    return [];
  }
}

export function writeHistory(profile: string, list: WatchEntry[]) {
  try {
    globalThis.localStorage?.setItem(storageKey(profile), JSON.stringify(list));
  } catch {
    // Ingen storage — så ingen historik. Siden virker stadig.
  }
}
