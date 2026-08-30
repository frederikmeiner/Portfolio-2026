"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

export default function NetflixIntro({ onComplete }: { onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);

  function handleClick() {
    if (started) return;
    setStarted(true);
    audioRef.current?.play().catch(() => {});
    setTimeout(onComplete, 3400);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={handleClick}
    >
      <audio ref={audioRef} src="/netflix-tudum-sfx-n-c.mp3" preload="auto" />

      <AnimatePresence mode="wait">
        {!started ? (
          /* Idle state — subtle prompt */
          <motion.p
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-sm tracking-widest uppercase select-none"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Klik for at fortsætte
          </motion.p>
        ) : (
          /* Intro animation */
          <motion.div key="intro" className="relative flex items-center justify-center w-full">
            {/* Red ambient glow */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.28, 0.1, 0] }}
              transition={{ duration: 3.2, times: [0, 0.3, 0.7, 1] }}
            >
              <div
                className="rounded-full blur-[100px]"
                style={{ width: 700, height: 220, background: "#E50914" }}
              />
            </motion.div>

            {/* Curved SVG text */}
            <motion.svg
              viewBox="0 0 620 190"
              width={620}
              height={190}
              className="max-w-[92vw]"
              initial={{ opacity: 0, scale: 1.7 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [1.7, 1, 1, 0.88],
              }}
              transition={{
                duration: 3.2,
                times: [0, 0.22, 0.72, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <defs>
                <path id="arc" d="M 20,158 Q 310,18 600,158" />
                <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                fill="#E50914"
                fontSize="56"
                fontWeight="900"
                fontFamily="'Archivo', sans-serif"
                letterSpacing="1"
                filter="url(#glow)"
              >
                <textPath href="#arc" startOffset="50%" textAnchor="middle">
                  Frederik Meiner
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
