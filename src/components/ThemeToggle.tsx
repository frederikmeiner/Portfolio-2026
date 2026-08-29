"use client";

import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export type Theme = "dark" | "light";

/** Skal matche det inline script i layout.tsx, som sætter temaet før første maling. */
export const THEME_STORAGE_KEY = "fm-theme";
const THEME_EVENT = "fm-theme-change";

/**
 * Temaet bor på <html data-theme>, ikke i React-state — det inline script i
 * layout.tsx sætter det, før React overhovedet kører. useSyncExternalStore
 * lader os læse den kilde uden at gætte på serveren og uden hydration-brok.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Privat browsing e.l. — temaet holder bare ikke til næste besøg.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Skift til lyst tema" : "Skift til mørkt tema"}
      title={isDark ? "Lyst tema" : "Mørkt tema"}
      className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full ${className}`}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? <Moon size={16} strokeWidth={1.9} /> : <Sun size={16} strokeWidth={1.9} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
