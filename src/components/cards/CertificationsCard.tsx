"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gradient = "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)";

export default function CertificationsCard() {
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
          
          <motion.div
            className="absolute inset-0 bg-black opacity-0"
            whileHover={{ opacity: 0.15 }}
            transition={{ duration: 0.2 }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-base font-bold leading-tight" style={{ color: "#fff", fontFamily: "var(--font-heading)" }}>
              Certifikationer
            </p>
            <p className="text-xs mt-1 opacity-75" style={{ color: "#fff", fontFamily: "var(--font-body)" }}>
              Kurser & certifikater
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-[420px] max-h-[85vh] overflow-y-auto flex flex-col items-center justify-center text-center rounded-2xl p-6 sm:p-10"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-lg sm:text-xl font-bold mb-2"
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
                >
                  Certifikationer
                </p>
                <p
                  className="text-sm sm:text-base"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
                >
                  Jeg har ikke nogle certifikationer... endnu 😅
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 sm:mt-8 px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
                  style={{
                    background: "var(--border)",
                    color: "var(--foreground)",
                    fontFamily: "var(--font-body)",
                    border: "none",
                  }}
                >
                  Luk
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
