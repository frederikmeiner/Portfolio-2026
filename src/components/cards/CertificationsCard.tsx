"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";

const gradient = "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)";

export default function CertificationsCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-xl overflow-hidden cursor-pointer text-left block"
          style={{ width: 264, height: 168, padding: 0, border: "none", background: "none" }}
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
        </motion.button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Certifikationer">
        <p
          className="text-sm sm:text-base"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Jeg har ikke nogle certifikationer... endnu 😅
        </p>
      </Modal>
    </>
  );
}
