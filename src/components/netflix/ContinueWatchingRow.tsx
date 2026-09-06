"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import ContentRow from "@/components/netflix/ContentRow";
import { CARD_ICONS } from "@/lib/card-icons";
import { PROFILES, cardHref, type CardSpec, type ProfileId } from "@/lib/profiles";
import { readHistory, storageKey, type WatchEntry } from "@/lib/watch-history";

const NETFLIX_RED = "#e50914";

const EMPTY: WatchEntry[] = [];
const cache = new Map<string, { raw: string | null; list: WatchEntry[] }>();

/**
 * Snapshot til useSyncExternalStore. Skal give samme reference, når intet er
 * ændret — ellers rendrer React i ring. Derfor caches på den rå streng.
 */
function snapshot(profile: ProfileId): WatchEntry[] {
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

/** Finder forsidens kort for et href, så historikken kan låne dets farve og ikon. */
function findCard(profile: ProfileId, href: string): CardSpec | undefined {
  for (const row of PROFILES[profile].home.rows) {
    const hit = row.cards.find((card) => cardHref(card, profile) === href);
    if (hit) return hit;
  }
  return undefined;
}

function HistoryCard({ entry, profile }: { entry: WatchEntry; profile: ProfileId }) {
  const card = findCard(profile, entry.href);
  const Icon = card ? CARD_ICONS[card.icon] : Film;

  return (
    <Link href={entry.href} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative rounded-xl overflow-hidden"
        style={{ width: 264, height: 168, background: card?.gradient ?? "var(--surface-2)" }}
      >
        {entry.image && <Image src={entry.image} alt="" fill sizes="264px" className="object-cover" />}
        {!entry.image && (
          <div className="absolute -top-2 -right-2 opacity-[0.18] select-none pointer-events-none">
            <Icon size={110} color="white" strokeWidth={1} />
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 flex items-center gap-2">
          <Icon size={14} color="white" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <p
            className="text-sm font-bold leading-tight truncate"
            style={{ color: "#fff", fontFamily: "var(--font-heading)" }}
          >
            {entry.title}
          </p>
        </div>
        {/* Den røde bjælke — det eneste Netflix-element folk genkender med det samme */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: "rgba(255,255,255,0.25)" }}>
          <div style={{ height: "100%", width: `${Math.round(entry.progress * 100)}%`, background: NETFLIX_RED }} />
        </div>
      </motion.div>
    </Link>
  );
}

/** Besøgerens egen historik for profilen. Serveren ser altid en tom liste, så HTML'en er ens for alle. */
export default function ContinueWatchingRow({ profile }: { profile: ProfileId }) {
  const entries = useSyncExternalStore(subscribe, () => snapshot(profile), () => EMPTY);

  if (entries.length === 0) return null;

  return (
    <div className="mt-10">
      <h2
        className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        Continue Watching for {PROFILES[profile].label}
      </h2>
      <ContentRow title="">
        {entries.map((entry) => (
          <HistoryCard key={entry.href} entry={entry} profile={profile} />
        ))}
      </ContentRow>
    </div>
  );
}
