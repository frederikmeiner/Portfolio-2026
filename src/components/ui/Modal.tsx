"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Overskriften i dialogen — bruges også som dens tilgængelige navn. */
  title: string;
  children: React.ReactNode;
};

/**
 * Dialogen bag kortene i indholdsrækkerne.
 *
 * Lå før som løs markup i hvert kort: en div uden rolle, uden Escape og uden
 * fokushåndtering, så en tastaturbruger kunne åbne den men ikke komme ud igen.
 * Her ligger opførslen ét sted, så begge kort opfører sig ens.
 */
export default function Modal({ open, onClose, title, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Effekten nedenfor må kun køre når dialogen åbner/lukker — ikke hver gang
  // forælderen sender en ny onClose-funktion (fx en inline arrow, der får ny
  // identitet ved hvert tastetryk i en formular). Ellers flytter den fokus
  // fra feltet til panelet for hvert bogstav.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    // Husk hvad der åbnede dialogen, så fokus kan lægges tilbage bagefter.
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className="pointer-events-auto w-full max-w-[420px] max-h-[85vh] overflow-y-auto flex flex-col items-center justify-center text-center rounded-2xl p-6 sm:p-10 outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <p
                id={titleId}
                className="text-lg sm:text-xl font-bold mb-2"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
              >
                {title}
              </p>
              {children}
              <button
                type="button"
                onClick={onClose}
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
  );
}
