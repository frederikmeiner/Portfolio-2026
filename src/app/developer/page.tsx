"use client";

import NetflixNav from "@/components/netflix/NetflixNav";
import HeroSection from "@/components/netflix/HeroSection";
import ContentRow from "@/components/netflix/ContentRow";
import CategoryCard from "@/components/cards/CategoryCard";
import CertificationsCard from "@/components/cards/CertificationsCard";
import AnbefalingerCard from "@/components/cards/AnbefalingerCard";
import { Zap, Rocket, Briefcase, Mail, Music, Lightbulb, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CardItem = {
  title: string;
  description: string;
  href: string;
  gradient: string;
  icon: LucideIcon;
};

const topPicks: CardItem[] = [
  { title: "Skills", description: "Next.js, TypeScript, React, WordPress & mere", href: "/developer/skills", gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", icon: Zap },
  { title: "Projekter", description: "25+ stykker — Danida, ICARS, Genan", href: "/developer/projects", gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", icon: Rocket },
  { title: "Erfaring", description: "Fra studiejob til senior, samme sted", href: "/developer/experience", gradient: "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)", icon: Briefcase },
  { title: "Kontakt", description: "Skriv endelig", href: "/developer/contact", gradient: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)", icon: Mail },
];

const continueWatching: CardItem[] = [
  { title: "Musik", description: "Hvad der spiller lige nu", href: "/developer/music", gradient: "linear-gradient(135deg, #14532d 0%, #1db954 100%)", icon: Music },
  { title: "Inspiration", description: "Hvad der driver mig", href: "/developer/inspiration", gradient: "linear-gradient(135deg, #4a1d96 0%, #a855f7 100%)", icon: Lightbulb },
  { title: "Kontakt", description: "Lad os snakke sammen", href: "/developer/contact", gradient: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)", icon: Mail },
];

export default function DeveloperPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <NetflixNav profileLabel="Udvikler" profileAvatar="/avatar-developer.png" />
      <HeroSection profileLabel="Udvikler" />

      <div className="pt-8 pb-24">
        <h2
          className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Today&apos;s Top Picks for Udvikler
        </h2>

        <ContentRow title="">
          {topPicks.map((item) => (
            <CategoryCard key={item.href} {...item} />
          ))}
          <AnbefalingerCard />
        </ContentRow>

        <div className="mt-10">
          <h2
            className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            Continue Watching for Udvikler
          </h2>

          <ContentRow title="">
            {continueWatching.map((item) => (
              <CategoryCard key={item.href} {...item} />
            ))}
            <CertificationsCard />
            <CategoryCard
              title="Ønskeliste"
              description="Supabase, Google-login og RLS der skjuler reservationer for ejeren"
              href="/developer/wishlist"
              gradient="linear-gradient(135deg, #831843 0%, #ec4899 100%)"
              icon={Gift}
            />
          </ContentRow>
        </div>
      </div>
    </div>
  );
}