"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = { error: Error & { digest?: string }; reset: () => void };

/** Fanger fejl under render, så besøgende får en vej videre i stedet for Nexts standardside. */
export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 text-center"
      style={{ background: "var(--background)" }}
    >
      <div className="flex max-w-xl flex-col items-center">
        <h1
          className="text-4xl font-bold leading-tight md:text-6xl"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
        >
          Noget gik galt
        </h1>
        <p
          className="mt-5 text-base leading-relaxed md:text-lg"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Siden kunne ikke vises lige nu. Prøv igen — eller gå tilbage til forsiden.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="cursor-pointer rounded px-7 py-3 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
            style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-body)" }}
          >
            Prøv igen
          </button>
          <Link
            href="/"
            className="rounded px-7 py-3 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
            style={{
              background: "var(--surface-2)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
            }}
          >
            Til forsiden
          </Link>
        </div>

        {error.digest && (
          <p
            className="mt-12 border-l-2 pl-3 text-xs uppercase tracking-widest"
            style={{ color: "var(--muted)", borderColor: "#e50914", fontFamily: "var(--font-body)" }}
          >
            Fejlkode <strong style={{ color: "var(--foreground)" }}>{error.digest}</strong>
          </p>
        )}
      </div>
    </main>
  );
}
