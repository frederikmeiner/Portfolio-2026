"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Music } from "lucide-react";
import HeroBackdrop from "@/components/netflix/HeroBackdrop";

type Props = { media: string };

/** Forsiden for familie og venner: ønskelisten er hovedpersonen, ikke CV'et. */
export default function FamilyHero({ media }: Props) {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ height: "70vh" }}>
      <HeroBackdrop media={media} />

      <div className="relative z-10 px-5 md:px-16 lg:px-24 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: "#ec4899", fontFamily: "var(--font-body)" }}
        >
          Familie & venner
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-heading)", color: "var(--on-media)" }}
        >
          Ønskelisten
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl font-light max-w-xl mb-10 leading-relaxed"
          style={{ color: "var(--on-media-muted)", fontFamily: "var(--font-body)" }}
        >
          Reservér et ønske, så I ikke køber det samme. Jeg kan ikke se, hvem der har
          taget hvad — kun at det er taget. Log ind med Google eller få en kode på mail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="/family/wishlist"
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-opacity duration-200 hover:opacity-85"
            style={{ background: "var(--on-media)", color: "var(--on-media-ink)", fontFamily: "var(--font-body)" }}
          >
            <Gift size={16} />
            Se ønskelisten
          </Link>
          <Link
            href="/family/music"
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-colors duration-200"
            style={{
              background: "var(--on-media-tint)",
              color: "var(--on-media)",
              border: "1px solid var(--on-media-tint-strong)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Music size={16} />
            Hvad jeg hører
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
