"use client";

import NetflixNav from "@/components/netflix/NetflixNav";
import HeroSection from "@/components/netflix/HeroSection";
import ContentRow from "@/components/netflix/ContentRow";
import CategoryCard from "@/components/cards/CategoryCard";
import { Briefcase, Zap, Rocket, GraduationCap, Star, Mail } from "lucide-react";
import CertificationsCard from "@/components/cards/CertificationsCard";
import type { LucideIcon } from "lucide-react";

type CardItem = {
  title: string;
  description: string;
  href: string;
  gradient: string;
  icon: LucideIcon;
};

const topPicks: CardItem[] = [
  { title: "Erfaring", description: "4+ års professionel erfaring", href: "/recruiter/experience", gradient: "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)", icon: Briefcase },
  { title: "Skills", description: "Frontend, Backend, DevOps & mere", href: "/recruiter/skills", gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", icon: Zap },
  { title: "Projekter", description: "25+ leverede projekter", href: "/recruiter/projects", gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", icon: Rocket },
  { title: "Certifikationer", description: "Kurser & certifikater", href: "/recruiter/certifications", gradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)", icon: GraduationCap },
  { title: "Anbefalinger", description: "Referencer fra samarbejdspartnere", href: "/recruiter/recommendations", gradient: "linear-gradient(135deg, #881337 0%, #f43f5e 100%)", icon: Star },
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
          <CertificationsCard />
        </ContentRow>
      </div>
    </div>
  );
}
