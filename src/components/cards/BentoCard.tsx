"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { BentoItem } from "@/lib/sanity/queries";

type Props = { item: BentoItem; index: number };

const gradientPool = [
  "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
  "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
  "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
  "linear-gradient(135deg, #881337 0%, #e11d48 100%)",
  "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)",
  "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
  "linear-gradient(135deg, #713f12 0%, #ca8a04 100%)",
];

function getSpans(size?: string) {
  if (size === "large") return { col: 2, row: 2 };
  if (size === "tall")  return { col: 1, row: 2 };
  return { col: 1, row: 1 };
}

function getHostname(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

export default function BentoCard({ item, index }: Props) {
  const gradient = gradientPool[index % gradientPool.length];
  const { col, row } = getSpans(item.size);
  const isLarge = item.size === "large";
  const isBig = item.size === "large" || item.size === "tall";
  // Internt link (titel-side) vinder over det eksterne. Hostname vises kun for
  // eksterne — "danida.dk" nederst på et kort, der går til titel-siden, giver ingen mening.
  const internal = item.href;
  const external = internal ? undefined : item.liveUrl;
  const href = internal ?? external;
  const hostname = getHostname(external);

  const imageUrl = item.image?.asset.url ?? null;

  const card = (
    <motion.div
      className="group relative overflow-hidden rounded-2xl w-full h-full"
      style={{ cursor: href ? "pointer" : "default" }}
      whileHover="hovered"
      initial="idle"
    >
      {/* Media */}
      <motion.div
        className="absolute inset-0"
        variants={{ idle: { scale: 1 }, hovered: { scale: 1.07 } }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {item.videoUrl ? (
          // Video vinder over billedet. Screenshottet bruges som poster,
          // så kortet ikke står sort mens videoen loader.
          <video
            src={item.videoUrl}
            poster={imageUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full" style={{ background: gradient }} />
        )}
      </motion.div>

      {/* Persistent bottom gradient + title (fades out on hover) */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }}
        variants={{ idle: { opacity: 1 }, hovered: { opacity: 0 } }}
        transition={{ duration: 0.22 }}
      >
        <p
          className="font-bold text-white leading-tight"
          style={{ fontFamily: "var(--font-heading)", fontSize: isLarge ? "1.15rem" : "0.875rem" }}
        >
          {item.title}
        </p>
      </motion.div>

      {/* Slide-up info panel */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 flex flex-col justify-end"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.96) 60%, rgba(0,0,0,0.0) 100%)",
          backdropFilter: "blur(1px)",
          padding: isBig ? "1.5rem" : "1rem 0.875rem",
        }}
        variants={{ idle: { y: "100%", opacity: 0 }, hovered: { y: "0%", opacity: 1 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="font-black text-white leading-tight mb-1.5"
          style={{ fontFamily: "var(--font-heading)", fontSize: isLarge ? "1.25rem" : "0.95rem" }}
          variants={{ idle: { y: 8, opacity: 0 }, hovered: { y: 0, opacity: 1 } }}
          transition={{ duration: 0.28, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.title}
        </motion.p>

        {item.description && (
          <motion.p
            className="text-white/60 leading-relaxed"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              display: "-webkit-box",
              WebkitLineClamp: isBig ? 3 : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            variants={{ idle: { y: 8, opacity: 0 }, hovered: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.28, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.description}
          </motion.p>
        )}

        {hostname && (
          <motion.div
            className="flex items-center gap-1.5 mt-2"
            variants={{ idle: { y: 6, opacity: 0 }, hovered: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.26, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <ExternalLink size={10} color="rgba(255,255,255,0.35)" />
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body)" }}
            >
              {hostname}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Subtle border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={{ idle: { opacity: 0 }, hovered: { opacity: 1 } }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)" }}
      />
    </motion.div>
  );

  const span = { gridColumn: `span ${col}`, gridRow: `span ${row}`, display: "block" } as const;

  if (internal) {
    return (
      <Link href={internal} style={span}>
        {card}
      </Link>
    );
  }
  return external ? (
    <a href={external} target="_blank" rel="noopener noreferrer" style={span}>
      {card}
    </a>
  ) : (
    <div style={span}>{card}</div>
  );
}
