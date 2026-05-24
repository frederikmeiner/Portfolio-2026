"use client";

import NetflixNav from "@/components/netflix/NetflixNav";
import HeroSection from "@/components/netflix/HeroSection";
import ContentRow from "@/components/netflix/ContentRow";
import CategoryCard from "@/components/cards/CategoryCard";
import CertificationsCard from "@/components/cards/CertificationsCard";
import AnbefalingerCard from "@/components/cards/AnbefalingerCard";
import { Zap, Rocket, Briefcase, Mail, Music, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CardItem = {
  title: string;
  description: string;
  href: string;
  gradient: string;
  icon: LucideIcon;
};

const topPicks: CardItem[] = [
  { title: "Skills", description: "Frontend, Backend, DevOps & mere", href: "/recruiter/skills", gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", icon: Zap },
  { title: "Projekter", description: "25+ leverede projekter", href: "/recruiter/projects", gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", icon: Rocket },
  { title: "Erfaring", description: "5+ års professionel erfaring", href: "/recruiter/experience", gradient: "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)", icon: Briefcase },
  { title: "Kontakt", description: "Lad os snakke sammen", href: "/recruiter/contact", gradient: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)", icon: Mail },
];

const continueWatching: CardItem[] = [
  { title: "Musik", description: "Hvad jeg lytter til", href: "/recruiter/music", gradient: "linear-gradient(135deg, #14532d 0%, #1db954 100%)", icon: Music },
  { title: "Inspiration", description: "Hvad der driver mig", href: "/recruiter/inspiration", gradient: "linear-gradient(135deg, #4a1d96 0%, #a855f7 100%)", icon: Lightbulb },
  { title: "Kontakt", description: "Lad os snakke sammen", href: "/recruiter/contact", gradient: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)", icon: Mail },
];

export default function RecruiterPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <NetflixNav profileLabel="Rekrutterer" profileEmoji="🎯" />
      <HeroSection profileLabel="Rekrutterer" gifUrl="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ5eWwwbjRpdWM1amxyd3VueHhteTVzajVjeGZtZGJ1dDc4MXMyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/16u7Ifl2T4zYfQ932F/giphy.gif" />

      <div className="pt-8 pb-24">
        <h2
          className="px-8 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Today&apos;s Top Picks for Rekrutterer
        </h2>

        <ContentRow title="">
          {topPicks.map((item) => (
            <CategoryCard key={item.href} {...item} />
          ))}
          <AnbefalingerCard />
        </ContentRow>

        <div className="mt-10">
          <h2
            className="px-8 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            Continue Watching for Rekrutterer
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