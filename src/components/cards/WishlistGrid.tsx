"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Gift, Check, LogOut, Undo2, ShieldCheck, Eye } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import type { Wish } from "@/lib/sanity/queries";

type WishlistUser = { id: string; name: string };

type Props = {
  items?: Wish[];
  /** false når Supabase-nøgler mangler — så vises listen uden reservations-UI. */
  authReady?: boolean;
  user?: WishlistUser | null;
  /** Ejeren ser aldrig reservationer — hverken hvilke eller af hvem. */
  isOwner?: boolean;
  reservedIds?: string[];
  myIds?: string[];
};

function getHostname(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

type Detail = { label: string; value: string; color?: string };

/** De faste detaljefelter i fast rækkefølge — tomme felter springes over. */
function getDetails(item: Wish): Detail[] {
  return [
    { label: "Mærke", value: item.brand },
    { label: "Farve", value: item.color, color: item.colorHex },
    { label: "Størrelse", value: item.size },
    { label: "Længde", value: item.length },
  ].filter((d): d is Detail => Boolean(d.value));
}

function DetailChip({ detail }: { detail: Detail }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.7rem] leading-none"
      style={{ background: "var(--surface)", fontFamily: "var(--font-body)" }}
    >
      {detail.color && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: detail.color, boxShadow: "inset 0 0 0 1px rgba(128,128,128,0.4)" }}
        />
      )}
      <span
        className="text-[0.6rem] font-medium uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {detail.label}
      </span>
      <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{detail.value}</span>
    </span>
  );
}

function GoogleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.3z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.500 46 24 46z" />
      <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-2.9.7-4.3v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.6z" />
      <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.8 4.5 13.9l7.3 5.7c1.7-5.2 6.5-8.9 12.2-8.9z" />
    </svg>
  );
}

export default function WishlistGrid({
  items = [],
  authReady = false,
  user = null,
  isOwner = false,
  reservedIds = [],
  myIds = [],
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reserved, setReserved] = useState(() => new Set(reservedIds));
  const [mine, setMine] = useState(() => new Set(myIds));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showReservations = authReady && Boolean(user);
  const takenCount = showReservations ? reserved.size : 0;

  async function signIn() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
      },
    });
  }

  async function signOut() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    startTransition(() => router.refresh());
  }

  async function reserve(wishId: string) {
    setBusyId(wishId);
    setMessage(null);
    const supabase = getBrowserSupabase();
    const { error } = await supabase.from("reservations").insert({ wish_id: wishId });
    setBusyId(null);

    if (!error) {
      setReserved((s) => new Set(s).add(wishId));
      setMine((s) => new Set(s).add(wishId));
    } else if (error.code === "23505") {
      // Unik-constraint i databasen: en anden nåede den først.
      setReserved((s) => new Set(s).add(wishId));
      setMessage("En anden nåede at reservere den lige før dig.");
    } else {
      setMessage("Noget gik galt. Prøv igen.");
    }
    startTransition(() => router.refresh());
  }

  async function unreserve(wishId: string) {
    setBusyId(wishId);
    setMessage(null);
    const supabase = getBrowserSupabase();
    const { error } = await supabase.from("reservations").delete().eq("wish_id", wishId);
    setBusyId(null);

    if (!error) {
      setReserved((s) => {
        const next = new Set(s);
        next.delete(wishId);
        return next;
      });
      setMine((s) => {
        const next = new Set(s);
        next.delete(wishId);
        return next;
      });
    } else {
      setMessage("Kunne ikke fjerne reservationen. Prøv igen.");
    }
    startTransition(() => router.refresh());
  }

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-3xl py-24"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          Tilføj ønsker i Sanity Studio → /studio
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Privatliv + login — én linje, ikke en plakat */}
      {authReady && (
        <div
          className="mb-7 flex flex-col gap-4 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:gap-5"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          {isOwner ? (
            <Eye size={16} style={{ color: "#facc15", flexShrink: 0 }} />
          ) : (
            <ShieldCheck size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
          )}

          <p
            className="flex-1 text-[0.84rem] leading-relaxed"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            {isOwner ? (
              <>
                <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
                  Skjul for ejer er slået fra.
                </span>{" "}
                Du ser siden som gæsterne. Slå den til i{" "}
                <code style={{ fontSize: "0.95em" }}>wishlist_hide_from_owner()</code>, før du deler listen.
              </>
            ) : (
              <>
                <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
                  Frederik kan ikke se, hvad du reserverer.
                </span>{" "}
                Det er spærret i databasen, ikke bare skjult på siden — og andre gæster ser kun{" "}
                <em>at</em> en gave er taget.
              </>
            )}
          </p>

          {user ? (
            <div className="flex items-center gap-3">
              <span
                className="text-xs"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
              >
                {user.name}
              </span>
              <button
                onClick={signOut}
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-opacity hover:opacity-70"
                style={{
                  background: "var(--surface)",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  border: "1px solid var(--border)",
                }}
              >
                <LogOut size={12} />
                Log ud
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="flex cursor-pointer items-center justify-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "#fff",
                color: "#1f1f1f",
                fontFamily: "var(--font-body)",
                border: "1px solid rgba(0,0,0,0.08)",
                flexShrink: 0,
              }}
            >
              <GoogleMark />
              Log ind
            </button>
          )}
        </div>
      )}

      {showReservations && (
        <div className="mb-5 flex items-center gap-3">
          <span className="text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {takenCount} af {items.length} reserveret
          </span>
          <div
            className="h-1 flex-1 overflow-hidden rounded-full"
            style={{ background: "var(--border)", maxWidth: 160 }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(takenCount / items.length) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "var(--accent)" }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 rounded-2xl px-4 py-3 text-sm"
            style={{
              background: "color-mix(in srgb, var(--accent) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
              color: "var(--foreground)",
              fontFamily: "var(--font-body)",
            }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const isMine = showReservations && mine.has(item._id);
          const isTaken = showReservations && reserved.has(item._id) && !isMine;
          const hostname = getHostname(item.url);
          const details = getDetails(item);
          const imageUrl = item.image?.asset.url;
          // Fotoets egen kantfarve, så den fritlagte baggrund flyder ud i
          // fladen i stedet for at stå som en kasse. Falder tilbage til et
          // neutralt studielys, hvis farven ikke er beregnet endnu.
          const tile = item.plateColor ?? "#f2f2f3";
          const busy = busyId === item._id || pending;

          return (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-lg"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              {/* Produktflade — baggrunden følger billedets egen dominerende
                  farve, så fritlægninger på hvid smelter sammen med feltet
                  i stedet for at ligge som en kasse i en kasse. */}
              <a
                href={item.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={item.url ? 0 : -1}
                className="relative block aspect-square overflow-hidden"
                style={{
                  cursor: item.url ? "pointer" : "default",
                  pointerEvents: item.url ? "auto" : "none",
                  background: tile,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div className="absolute inset-[9%] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      className="object-contain"
                      style={{
                        transition: "filter 0.35s ease",
                        filter: isTaken ? "grayscale(1) opacity(0.45)" : "none",
                      }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Gift size={44} color="var(--muted)" strokeWidth={1.1} />
                    </div>
                  )}
                </div>

                {isTaken && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="rounded-full px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        background: "rgba(12,12,12,0.78)",
                        backdropFilter: "blur(8px)",
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Reserveret
                    </span>
                  </div>
                )}

                {isMine && (
                  <span
                    className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold"
                    style={{ background: "#10b981", color: "#04231a", fontFamily: "var(--font-body)" }}
                  >
                    <Check size={11} strokeWidth={3} />
                    Din
                  </span>
                )}
              </a>

              {/* Indhold */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3
                  className="text-[0.92rem] font-semibold leading-snug"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-heading)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "2.6em",
                  }}
                  title={item.title}
                >
                  {item.title}
                </h3>

                {item.price && (
                  <p
                    className="text-[1.05rem] font-semibold leading-none"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
                  >
                    {item.price}
                  </p>
                )}

                {details.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {details.map((d) => (
                      <DetailChip key={d.label} detail={d} />
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-3 pt-1">
                  {hostname && item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
                      style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
                    >
                      <ExternalLink size={11} />
                      {hostname}
                    </a>
                  )}

                  {showReservations &&
                    (isMine ? (
                      <button
                        onClick={() => unreserve(item._id)}
                        disabled={busy}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:opacity-50"
                        style={{
                          background: "transparent",
                          color: "#34d399",
                          border: "1px solid rgba(16,185,129,0.45)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <Undo2 size={14} />
                        Fortryd
                      </button>
                    ) : isTaken ? (
                      <div
                        className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm"
                        style={{
                          background: "transparent",
                          color: "var(--muted)",
                          border: "1px dashed var(--border)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Nogen har taget denne
                      </div>
                    ) : (
                      <button
                        onClick={() => reserve(item._id)}
                        disabled={busy}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:opacity-50"
                        style={{
                          background: "var(--accent)",
                          color: "#fff",
                          border: "1px solid transparent",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <Gift size={14} />
                        Reservér
                      </button>
                    ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
