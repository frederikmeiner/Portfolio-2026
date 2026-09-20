import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PROFILES, PROFILE_IDS } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Faret vild?",
  robots: { index: false, follow: false },
};

/** Netflix' "Lost your way?" — samme hero-billede som forsiden, så man stadig er på sitet. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 text-center">
      <Image src="/hero-developer.jpg" alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.9) 75%)" }}
      />

      <div className="relative flex max-w-xl flex-col items-center">
        <h1
          className="text-5xl font-bold leading-tight md:text-7xl"
          style={{ color: "var(--on-media)", fontFamily: "var(--font-heading)" }}
        >
          Faret vild?
        </h1>
        <p
          className="mt-5 text-base leading-relaxed md:text-lg"
          style={{ color: "var(--on-media-muted)", fontFamily: "var(--font-body)" }}
        >
          Den side findes ikke — eller også er den taget af programmet. Der er masser at se på forsiden.
        </p>

        <Link
          href="/"
          className="mt-8 rounded px-7 py-3 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
          style={{ background: "var(--on-media)", color: "var(--on-media-ink)", fontFamily: "var(--font-body)" }}
        >
          Til forsiden
        </Link>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm" style={{ fontFamily: "var(--font-body)" }}>
          {PROFILE_IDS.map((id) => (
            <li key={id}>
              <Link
                href={PROFILES[id].href}
                className="underline-offset-4 transition-opacity hover:underline hover:opacity-100"
                style={{ color: "var(--on-media-muted)" }}
              >
                {PROFILES[id].label}
              </Link>
            </li>
          ))}
        </ul>

        <p
          className="mt-12 border-l-2 pl-3 text-xs uppercase tracking-widest"
          style={{ color: "var(--on-media-muted)", borderColor: "#e50914", fontFamily: "var(--font-body)" }}
        >
          Fejlkode <strong style={{ color: "var(--on-media)" }}>FM-404</strong>
        </p>
      </div>
    </main>
  );
}
