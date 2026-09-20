"use client";

import { useSyncExternalStore } from "react";
import { readHistory, storageKey, type WatchEntry } from "@/lib/watch-history";

const EMPTY: WatchEntry[] = [];
const cache = new Map<string, { raw: string | null; list: WatchEntry[] }>();

/**
 * Snapshot til useSyncExternalStore. Skal give samme reference, når intet er
 * ændret — ellers rendrer React i ring. Derfor caches på den rå streng.
 */
function snapshot(profile: string): WatchEntry[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKey(profile));
  } catch {
    return EMPTY;
  }
  const hit = cache.get(profile);
  if (hit && hit.raw === raw) return hit.list;
  const list = readHistory(profile);
  const stable = list.length ? list : EMPTY;
  cache.set(profile, { raw, list: stable });
  return stable;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Besøgerens historik for profilen. Serveren ser altid en tom liste, så HTML'en er ens for alle. */
export function useWatchHistory(profile: string): WatchEntry[] {
  return useSyncExternalStore(subscribe, () => snapshot(profile), () => EMPTY);
}
