"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  songUrl: string;
};

export default function SpotifyPlayer() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    async function fetchNowPlaying() {
      const res = await fetch("/api/spotify/now-playing");
      if (res.ok) setTrack(await res.json());
    }
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {track?.isPlaying ? "🎵 Spiller nu" : "Sidst afspillet"}
      </p>

      <AnimatePresence mode="wait">
        {track ? (
          <motion.a
            key={track.title}
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-5 p-5 rounded-xl cursor-pointer group"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              textDecoration: "none",
            }}
          >
            {/* Album art */}
            {track.albumArt && (
              <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 72, height: 72 }}>
                <Image src={track.albumArt} alt={track.album} fill sizes="72px" className="object-cover" />
                {track.isPlaying && (
                  <div className="absolute inset-0 flex items-end justify-center pb-1 gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full"
                        style={{ background: "#1db954" }}
                        animate={{ height: ["4px", "14px", "4px"] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="font-semibold truncate"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
              >
                {track.title}
              </p>
              <p
                className="text-sm mt-0.5 truncate"
                style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
              >
                {track.artist}
              </p>
              <p
                className="text-xs mt-1 truncate"
                style={{ color: "var(--border)", fontFamily: "var(--font-body)" }}
              >
                {track.album}
              </p>
            </div>

            <ExternalLink size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--muted)" }} />
          </motion.a>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 rounded-xl"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              Henter Spotify data...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
