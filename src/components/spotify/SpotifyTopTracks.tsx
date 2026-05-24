"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Track = {
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  songUrl: string;
  duration: number;
};

function formatDuration(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SpotifyTopTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetch("/api/spotify/top-tracks")
      .then((r) => r.ok ? r.json() : Promise.resolve({ tracks: [] }))
      .then((d) => setTracks(d.tracks ?? []))
      .catch(() => {});
  }, []);

  if (!tracks.length) return null;

  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        Top tracks denne måned
      </p>

      <div className="flex flex-col gap-2">
        {tracks.map((track, i) => (
          <motion.a
            key={track.songUrl}
            href={track.songUrl}
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

            {track.albumArt && (
              <div className="relative flex-shrink-0 rounded overflow-hidden" style={{ width: 40, height: 40 }}>
                <Image src={track.albumArt} alt={track.album} fill sizes="40px" className="object-cover" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                {track.title}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                {track.artist}
              </p>
            </div>

            <span className="text-xs flex-shrink-0" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              {formatDuration(track.duration)}
            </span>

            <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
