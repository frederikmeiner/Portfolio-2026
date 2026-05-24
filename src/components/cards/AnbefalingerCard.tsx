"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gradient = "linear-gradient(135deg, #881337 0%, #f43f5e 100%)";
const Star = () => (
  <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.18 }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function AnbefalingerCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
        <motion.div
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-xl overflow-hidden cursor-pointer"
          style={{ width: 264, height: 168 }}
        >
          <div className="absolute inset-0" style={{ background: gradient }} />
          <div className="absolute -top-2 -right-2 select-none pointer-events-none">
            <Star />
          </div>
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileHover={{ opacity: 0.07 }}
            transition={{ duration: 0.2 }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.95, flexShrink: 0 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <p className="text-sm font-bold leading-tight" style={{ color: "#fff", fontFamily: "var(--font-heading)" }}>
                Anbefalinger
              </p>
            </div>
            <p className="text-xs leading-snug" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)" }}>
              Referencer fra samarbejdspartnere
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed z-50 flex flex-col items-center justify-center text-center rounded-2xl p-10"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                width: "min(90vw, 420px)",
              }}
            >
              <p
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
              >
                Anbefalinger
              </p>
              <p
                className="text-base"
                style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
              >
                Alle jeg har arbejdet med er enige om, at jeg er fremragende. De er bare utilgængelige for kommentar.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-8 px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
                style={{
                  background: "var(--border)",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-body)",
                  border: "none",
                }}
              >
                Luk
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
