"use client";

import NetflixNav from "@/components/netflix/NetflixNav";
import HeroSection from "@/components/netflix/HeroSection";
import ContentRow from "@/components/netflix/ContentRow";
import CategoryCard from "@/components/cards/CategoryCard";
import CertificationsCard from "@/components/cards/CertificationsCard";
import { Zap, Rocket, Briefcase, Star, Mail, Music, BookOpen, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CardItem = {
  title: string;
  description: string;
  href: string;
  gradient: string;
  icon: LucideIcon;
};

const topPicks: CardItem[] = [
  { title: "Skills", description: "Frontend, Backend, DevOps & mere", href: "/developer/skills", gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", icon: Zap },
  { title: "Projekter", description: "25+ leverede projekter", href: "/developer/projects", gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", icon: Rocket },
  { title: "Erfaring", description: "4+ års professionel erfaring", href: "/developer/experience", gradient: "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)", icon: Briefcase },
  { title: "Anbefalinger", description: "Referencer fra samarbejdspartnere", href: "/developer/recommendations", gradient: "linear-gradient(135deg, #881337 0%, #f43f5e 100%)", icon: Star },
  { title: "Kontakt", description: "Lad os snakke sammen", href: "/developer/contact", gradient: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)", icon: Mail },
];

const continueWatching: CardItem[] = [
  { title: "Musik", description: "Hvad jeg lytter til", href: "/developer/music", gradient: "linear-gradient(135deg, #14532d 0%, #1db954 100%)", icon: Music },
  { title: "Læsning", description: "Bøger & artikler", href: "/developer/reading", gradient: "linear-gradient(135deg, #7c2d12 0%, #f97316 100%)", icon: BookOpen },
  { title: "Blogs", description: "Mine indlæg", href: "/developer/blogs", gradient: "linear-gradient(135deg, #312e81 0%, #6366f1 100%)", icon: PenLine },
  { title: "Kontakt", description: "Lad os snakke sammen", href: "/developer/contact", gradient: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)", icon: Mail },
];

export default function DeveloperPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <NetflixNav profileLabel="Udvikler" profileEmoji="💻" />
      <HeroSection profileLabel="Udvikler" />

      <div className="pt-8 pb-24">
        <h2
          className="px-8 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Today&apos;s Top Picks for Udvikler
        </h2>

        <ContentRow title="">
          {topPicks.map((item) => (
            <CategoryCard key={item.href} {...item} />
          ))}
        </ContentRow>

        <div className="mt-10">
          <h2
            className="px-8 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            Continue Watching for Udvikler
          </h2>

          <ContentRow title="">
            {continueWatching.map((item) => (
              <CategoryCard key={item.href} {...item} />
            ))}
            <CertificationsCard />
          </ContentRow>
        </div>
      </div>
    </div>
  );
}
