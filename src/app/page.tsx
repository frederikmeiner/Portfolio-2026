"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import NetflixIntro from "@/components/netflix/NetflixIntro";

const profiles = [
  { id: "developer", label: "Udvikler", emoji: "💻", color: "#2563eb" },
  { id: "recruiter", label: "Rekrutterer", emoji: "🎯", color: "#16a34a" },
];

export default function ProfileSelector() {
  const [introComplete, setIntroComplete] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelected(id);
    setTimeout(() => { window.location.href = `/${id}`; }, 600);
  }

  return (
    <>
      <AnimatePresence>
        {!introComplete && (
          <NetflixIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: introComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--background)" }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-16 text-center"
        style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}
      >
        Frederik Meiner
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-2xl md:text-3xl font-light mb-12 text-center"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
      >
        Hvem ser med?
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex gap-8 md:gap-16"
      >
        {profiles.map((profile) => (
          <motion.button
            key={profile.id}
            onClick={() => handleSelect(profile.id)}
            animate={selected === profile.id ? { scale: 1.15, opacity: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4 cursor-pointer bg-transparent border-none"
          >
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg flex items-center justify-center text-5xl md:text-6xl"
              style={{
                background: "var(--surface-2)",
                border: `2px solid ${selected === profile.id ? profile.color : "transparent"}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = profile.color;
              }}
              onMouseLeave={(e) => {
                if (selected !== profile.id)
                  (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
              }}
            >
              {profile.emoji}
            </motion.div>
            <span
              className="text-sm md:text-base font-medium"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              {profile.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
    </>
  );
}
