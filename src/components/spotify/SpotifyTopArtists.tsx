"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Artist = {
  name: string;
  image?: string;
  url: string;
  genres: string[];
};

export default function SpotifyTopArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    fetch("/api/spotify/top-artists")
      .then((r) => r.ok ? r.json() : Promise.resolve({ artists: [] }))
      .then((d) => setArtists(d.artists ?? []))
      .catch(() => {});
  }, []);

  if (!artists.length) return null;

  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        Top artister denne måned
      </p>

      <div className="flex flex-col gap-2">
        {artists.map((artist, i) => (
          <motion.a
            key={artist.url}
            href={artist.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex items-center gap-4 p-3 rounded-lg cursor-pointer group"
            style={{
              background: "transparent",
              border: "1px solid transparent",
              textDecoration: "none",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
            }}
          >
            <span
              className="text-xs w-5 text-right flex-shrink-0"
              style={{ color: "var(--border)", fontFamily: "var(--font-body)" }}
            >
              {i + 1}
            </span>

            {artist.image ? (
              <div className="relative flex-shrink-0 rounded-full overflow-hidden" style={{ width: 40, height: 40 }}>
                <Image src={artist.image} alt={artist.name} fill sizes="40px" className="object-cover" />
              </div>
            ) : (
              <div
                className="flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ width: 40, height: 40, background: "var(--surface-2)", color: "var(--muted)" }}
              >
                {artist.name[0]}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                {artist.name}
              </p>
              {artist.genres.length > 0 && (
                <p className="text-xs truncate capitalize" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                  {artist.genres.join(" · ")}
                </p>
              )}
            </div>

            <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
