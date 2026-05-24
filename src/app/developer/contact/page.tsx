"use client";

import SubPageLayout from "@/components/netflix/SubPageLayout";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

const EMAIL = "frederik.meiner@gmail.com";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <SubPageLayout title="" backHref="/developer" backLabel="Udvikler">
      <div className="min-h-[80vh] flex items-center">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start w-full max-w-5xl">

          {/* ── Photo column ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative flex-shrink-0 group"
          >
            {/* Atmospheric glow */}
            <div
              className="absolute -inset-6 rounded-3xl blur-[60px] opacity-30 transition-opacity duration-700 group-hover:opacity-50"
              style={{ background: "radial-gradient(ellipse, #2563eb 0%, #0ea5e9 60%, transparent 100%)" }}
            />

            {/* Photo frame */}
            <div
              className="relative w-64 h-80 lg:w-72 lg:h-96 rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)" }}
            >
              <Image
                src="/Frederik.jpg"
                alt="Frederik Meiner"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 256px, 288px"
              />
              {/* Cinematic gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.75) 100%)" }}
              />
              {/* Name on photo */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p
                  className="text-sm font-semibold tracking-widest uppercase opacity-70"
                  style={{ fontFamily: "var(--font-body)", color: "#fff" }}
                >
                  Frederik Meiner
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Content column ── */}
          <div className="flex flex-col gap-8 pt-0 lg:pt-4 text-center lg:text-left">

            <div className="flex flex-col gap-4">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}
              >
                Lad os<br />
                <span style={{ color: "var(--accent)" }}>snakke sammen</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
                className="text-base md:text-lg max-w-md"
                style={{ fontFamily: "var(--font-body)", color: "var(--muted)", lineHeight: "1.7" }}
              >
                Har du et projekt, en idé, eller vil du bare sige hej? Jeg er altid åben for en god snak — skriv til mig.
              </motion.p>
            </div>

            {/* Email + buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-5"
            >
              {/* Email pill */}
              <div
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl self-center lg:self-start"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  maxWidth: "fit-content",
                }}
              >
                <Mail size={15} style={{ color: "var(--accent)" }} />
                <span
                  className="text-sm font-medium tracking-wide"
                  style={{ fontFamily: "var(--font-body)", color: "var(--foreground)" }}
                >
                  {EMAIL}
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <motion.a
                  href={`mailto:${EMAIL}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                    boxShadow: "0 4px 24px rgba(37,99,235,0.35)",
                  }}
                >
                  <Mail size={15} />
                  Send mail
                </motion.a>

                <motion.button
                  onClick={copyEmail}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{
                    background: "var(--surface-2)",
                    color: copied ? "#10b981" : "var(--foreground)",
                    fontFamily: "var(--font-body)",
                    border: `1px solid ${copied ? "#10b98144" : "var(--border)"}`,
                    transition: "color 200ms, border-color 200ms",
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Kopieret" : "Kopiér mail"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
