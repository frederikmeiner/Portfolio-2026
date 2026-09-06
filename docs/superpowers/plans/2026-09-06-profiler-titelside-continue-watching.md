# Profiler som data, titel-side og Continue Watching — implementeringsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gør profilerne til data med én dynamisk rute (og tilføj profilen *Familie & venner*), giv hvert projekt en Netflix-titelside med "Mere som dette", og gør forsidens Continue Watching til besøgerens egen historik.

**Architecture:** `src/lib/profiles.ts` bliver den eneste sandhed om profiler; `src/app/[profile]/…` erstatter de to kopierede mapper. Titel-siden er en statisk genereret rute under `[profile]/projects/[slug]` med data fra Sanity. Continue Watching er rene funktioner over `localStorage`, læst i en client-komponent efter mount.

**Tech Stack:** Next.js 16 (App Router, `params` er et Promise), React 19, TypeScript, Tailwind v4, framer-motion, lucide-react, Sanity (GROQ), `node --test` (Node 24 kører `.test.ts` uden build).

**Spec:** `docs/superpowers/specs/2026-09-06-profiler-titelside-continue-watching-design.md`

## Global Constraints

- Eksisterende URL'er `/recruiter/…` og `/developer/…` ændrer sig ikke. Ny profil hedder `family` (`/family`, label "Familie & venner").
- `family` har kun siderne `wishlist`, `music`, `contact`. Andre sider → 404.
- Ønskelisten findes kun på `/family/wishlist`; `/recruiter/wishlist` og `/developer/wishlist` bliver permanente redirects.
- Filer i repoet er CRLF. Node-scripts, der skriver filer, skal bevare det (læs → arbejd på LF → skriv CRLF).
- Ingen nye npm-pakker. Tests kører med `npm test` = `node --test "src/**/*.test.ts"`. Testfiler må kun importere med relative stier (alias `@/` findes ikke under `node --test`) og må ikke importere `.tsx`.
- Rene moduler (`profiles.ts`, `related-projects.ts`, `watch-history.ts`) importerer ikke React, Next eller lucide.
- Kommentarer og UI-tekst er på dansk, som resten af koden.
- Verifikation før hver commit: `npx tsc --noEmit`, `npm run lint`, `npm test`. Før hvert push: `npm run build`.
- Push til `main` deployer automatisk (~2 min). Del A, B og C pushes hver for sig.

---

## Del A — profiler som data

### Task 1: Test-runner og `profiles.ts` som eneste sandhed

**Files:**
- Modify: `package.json` (scripts)
- Rewrite: `src/lib/profiles.ts`
- Create: `src/lib/profiles.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ProfileId = "developer" | "recruiter" | "family";
  export type PageId = "projects" | "skills" | "experience" | "inspiration" | "music" | "contact" | "wishlist";
  export type IconName = "zap" | "rocket" | "briefcase" | "mail" | "music" | "lightbulb" | "gift";
  export type CardSpec = { title: string; description: string; icon: IconName; gradient: string } & ({ page: PageId } | { href: string });
  export type RowSpec = { title: string; cards: CardSpec[]; extras?: ("anbefalinger" | "certifications")[] };
  export type HomeConfig = { hero: "work" | "wishlist"; rows: RowSpec[] };
  export type Profile = { href: string; label: string; avatar: string; color: string; heroMedia: string; pages: PageId[]; home: HomeConfig };
  export const PROFILES: Record<ProfileId, Profile>;
  export const PROFILE_IDS: ProfileId[];
  export function isProfileId(x: string): x is ProfileId;
  export function hasPage(profile: ProfileId, page: PageId): boolean;
  export function cardHref(card: CardSpec, profile: ProfileId): string;
  export function profilesWithPage(page: PageId): ProfileId[];
  ```
  `href` og `label` bevares, fordi alle `*Page`-komponenter allerede bruger `PROFILES[profile].href/label`.

- [ ] **Step 1: Tilføj test-script**

I `package.json` under `"scripts"`:
```json
"test": "node --test \"src/**/*.test.ts\""
```

- [ ] **Step 2: Skriv den fejlende test**

`src/lib/profiles.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { PROFILES, PROFILE_IDS, cardHref, hasPage, isProfileId, profilesWithPage } from "./profiles.ts";

test("de tre profiler findes med uændrede href", () => {
  assert.deepEqual(PROFILE_IDS, ["developer", "recruiter", "family"]);
  assert.equal(PROFILES.recruiter.href, "/recruiter");
  assert.equal(PROFILES.developer.href, "/developer");
  assert.equal(PROFILES.family.href, "/family");
  assert.equal(PROFILES.family.label, "Familie & venner");
});

test("family har kun det private", () => {
  assert.deepEqual(PROFILES.family.pages, ["wishlist", "music", "contact"]);
  assert.equal(hasPage("family", "projects"), false);
  assert.equal(hasPage("family", "wishlist"), true);
});

test("ønskelisten findes kun hos family", () => {
  assert.deepEqual(profilesWithPage("wishlist"), ["family"]);
  assert.deepEqual(profilesWithPage("projects"), ["developer", "recruiter"]);
});

test("isProfileId afviser ukendte", () => {
  assert.equal(isProfileId("family"), true);
  assert.equal(isProfileId("admin"), false);
});

test("cardHref løser page mod profilen og lader href være", () => {
  assert.equal(cardHref({ title: "", description: "", icon: "zap", gradient: "", page: "skills" }, "developer"), "/developer/skills");
  assert.equal(cardHref({ title: "", description: "", icon: "gift", gradient: "", href: "/family/wishlist" }, "recruiter"), "/family/wishlist");
});

test("alle kort på en forside peger på sider profilen har, eller på absolutte links", () => {
  for (const id of PROFILE_IDS) {
    for (const row of PROFILES[id].home.rows) {
      for (const card of row.cards) {
        if ("page" in card) assert.ok(hasPage(id, card.page), `${id}: kort '${card.title}' peger på ${card.page}`);
        else assert.ok(card.href.startsWith("/"), `${id}: '${card.title}' skal have relativ href`);
      }
    }
  }
});
```

- [ ] **Step 3: Kør testen — den skal fejle**

Run: `npm test`
Expected: FAIL — `PROFILE_IDS`/`hasPage` er ikke eksporteret.

- [ ] **Step 4: Skriv `src/lib/profiles.ts`**

```ts
/**
 * Den eneste sandhed om profilerne. Ruter, nav, profilvælger, sitemap og
 * forsider læser alle herfra — en ny profil er én post i PROFILES.
 *
 * Holdes fri for React/Next/lucide, så den kan testes med `node --test`.
 */
export type ProfileId = "developer" | "recruiter" | "family";

export type PageId = "projects" | "skills" | "experience" | "inspiration" | "music" | "contact" | "wishlist";

/** Navne, ikke komponenter — opslaget til lucide ligger i card-icons.ts. */
export type IconName = "zap" | "rocket" | "briefcase" | "mail" | "music" | "lightbulb" | "gift";

export type CardSpec = {
  title: string;
  description: string;
  icon: IconName;
  gradient: string;
} & ({ page: PageId } | { href: string });

export type RowSpec = {
  title: string;
  cards: CardSpec[];
  /** Særlige kort der ikke er rene links (anbefalinger, certificeringer). */
  extras?: ("anbefalinger" | "certifications")[];
};

export type HomeConfig = {
  /** "work" = den kendte hero med CV/LinkedIn; "wishlist" = familie-heroen. */
  hero: "work" | "wishlist";
  rows: RowSpec[];
};

export type Profile = {
  href: string;
  label: string;
  avatar: string;
  /** Kantfarve i profilvælgeren. */
  color: string;
  /** Basisnavn på hero-klippet i /public — .webm, .mp4 og .jpg med samme navn. */
  heroMedia: string;
  pages: PageId[];
  home: HomeConfig;
};

const G = {
  blue: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
  green: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
  amber: "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)",
  sky: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)",
  spotify: "linear-gradient(135deg, #14532d 0%, #1db954 100%)",
  purple: "linear-gradient(135deg, #4a1d96 0%, #a855f7 100%)",
  pink: "linear-gradient(135deg, #831843 0%, #ec4899 100%)",
} as const;

/** Rækkerne er ens for de to arbejdsprofiler — kun overskriften nævner profilen. */
function workHome(label: string): HomeConfig {
  return {
    hero: "work",
    rows: [
      {
        title: `Today's Top Picks for ${label}`,
        cards: [
          { title: "Skills", description: "Next.js, TypeScript, React, WordPress & mere", page: "skills", gradient: G.blue, icon: "zap" },
          { title: "Projekter", description: "25+ stykker — Danida, ICARS, Genan", page: "projects", gradient: G.green, icon: "rocket" },
          { title: "Erfaring", description: "Fra studiejob til senior, samme sted", page: "experience", gradient: G.amber, icon: "briefcase" },
          { title: "Kontakt", description: "Skriv endelig", page: "contact", gradient: G.sky, icon: "mail" },
        ],
        extras: ["anbefalinger"],
      },
      {
        title: "Mere fra Frederik",
        cards: [
          { title: "Musik", description: "Hvad der spiller lige nu", page: "music", gradient: G.spotify, icon: "music" },
          { title: "Inspiration", description: "Hvad der driver mig", page: "inspiration", gradient: G.purple, icon: "lightbulb" },
          { title: "Ønskelisten — som case", description: "Supabase, RLS der skjuler reservationer for ejeren, login med Google eller engangskode", href: "/family/wishlist", gradient: G.pink, icon: "gift" },
        ],
        extras: ["certifications"],
      },
    ],
  };
}

export const PROFILES: Record<ProfileId, Profile> = {
  developer: {
    href: "/developer",
    label: "Udvikler",
    avatar: "/avatar-developer.png",
    color: "#2563eb",
    heroMedia: "hero-developer",
    pages: ["projects", "skills", "experience", "inspiration", "music", "contact"],
    home: workHome("Udvikler"),
  },
  recruiter: {
    href: "/recruiter",
    label: "Rekrutterer",
    avatar: "/avatar-recruiter.png",
    color: "#16a34a",
    heroMedia: "hero-recruiter",
    pages: ["projects", "skills", "experience", "inspiration", "music", "contact"],
    home: workHome("Rekrutterer"),
  },
  family: {
    href: "/family",
    label: "Familie & venner",
    avatar: "/avatar-family.png",
    color: "#ec4899",
    // Genbruger rekrutterer-klippet indtil hero-family.{webm,mp4,jpg} ligger i /public.
    heroMedia: "hero-recruiter",
    pages: ["wishlist", "music", "contact"],
    home: {
      hero: "wishlist",
      rows: [
        {
          title: "Til dig",
          cards: [
            { title: "Ønskeliste", description: "Reservér — så køber I ikke det samme", page: "wishlist", gradient: G.pink, icon: "gift" },
            { title: "Musik", description: "Hvad der spiller lige nu", page: "music", gradient: G.spotify, icon: "music" },
            { title: "Kontakt", description: "Ring, skriv, kom forbi", page: "contact", gradient: G.sky, icon: "mail" },
          ],
        },
      ],
    },
  },
};

export const PROFILE_IDS = Object.keys(PROFILES) as ProfileId[];

export function isProfileId(x: string): x is ProfileId {
  return x in PROFILES;
}

export function hasPage(profile: ProfileId, page: PageId) {
  return PROFILES[profile].pages.includes(page);
}

export function profilesWithPage(page: PageId) {
  return PROFILE_IDS.filter((id) => hasPage(id, page));
}

export function cardHref(card: CardSpec, profile: ProfileId) {
  return "page" in card ? `${PROFILES[profile].href}/${card.page}` : card.href;
}
```

- [ ] **Step 5: Kør testen — den skal bestå**

Run: `npm test`
Expected: 6 pass, 0 fail.

- [ ] **Step 6: tsc + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: grønt (`NetflixNav` bruger stadig sin egen liste; `sitemap.ts` bruger `Object.keys(PROFILES)` og virker).

- [ ] **Step 7: Commit**

```bash
git add package.json src/lib/profiles.ts src/lib/profiles.test.ts
git commit -m "feat(profiler): profiles.ts er eneste sandhed — inkl. family-profilen"
```

---

### Task 2: Ikon-opslag og `CategoryCard` tager et ikon-navn

**Files:**
- Create: `src/lib/card-icons.ts`
- Modify: `src/components/cards/CategoryCard.tsx:1-15`

**Interfaces:**
- Consumes: `IconName` fra Task 1.
- Produces: `export const CARD_ICONS: Record<IconName, LucideIcon>`; `CategoryCard` props `icon: IconName` (før: `LucideIcon`).

- [ ] **Step 1: Skriv `src/lib/card-icons.ts`**

```ts
import { Briefcase, Gift, Lightbulb, Mail, Music, Rocket, Zap, type LucideIcon } from "lucide-react";
import type { IconName } from "@/lib/profiles";

/** profiles.ts kender kun navne, så den kan testes uden React — her bliver de til ikoner. */
export const CARD_ICONS: Record<IconName, LucideIcon> = {
  zap: Zap,
  rocket: Rocket,
  briefcase: Briefcase,
  mail: Mail,
  music: Music,
  lightbulb: Lightbulb,
  gift: Gift,
};
```

- [ ] **Step 2: Ret `CategoryCard`**

Erstat importen og props-typen øverst i `src/components/cards/CategoryCard.tsx`:
```tsx
import Link from "next/link";
import { motion } from "framer-motion";
import { CARD_ICONS } from "@/lib/card-icons";
import type { IconName } from "@/lib/profiles";

type Props = {
  title: string;
  description?: string;
  href: string;
  gradient: string;
  icon: IconName;
};

export default function CategoryCard({ title, description, href, gradient, icon }: Props) {
  const Icon = CARD_ICONS[icon];
```
Resten af komponenten er uændret (`<Icon size={110} …>` osv. virker som før). Fjern importen af `LucideIcon`.

- [ ] **Step 3: tsc**

Run: `npx tsc --noEmit`
Expected: Fejl i `src/app/recruiter/page.tsx` og `src/app/developer/page.tsx` (de sender `icon: Zap`). Det er forventet — de slettes i Task 6. Gå videre.

- [ ] **Step 4: Commit**

```bash
git add src/lib/card-icons.ts src/components/cards/CategoryCard.tsx
git commit -m "refactor(kort): CategoryCard tager ikon-navn fra profiles"
```

---

### Task 3: `HeroBackdrop` udtrækkes, `FamilyHero` bygges

**Files:**
- Create: `src/components/netflix/HeroBackdrop.tsx`
- Modify: `src/components/netflix/HeroSection.tsx:17-60` (baggrunden erstattes af `<HeroBackdrop media={media} />`)
- Create: `src/components/netflix/FamilyHero.tsx`

**Interfaces:**
- Produces: `HeroBackdrop({ media: string })`, `FamilyHero({ media: string })`.

- [ ] **Step 1: Skriv `HeroBackdrop`**

Flyt hele `<div className="absolute inset-0">…</div>`-blokken (video/poster + de to gradient-overlays) fra `HeroSection` hertil:

```tsx
"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";

type Props = {
  /** Basisnavn på klippet i /public — .webm, .mp4 og .jpg med samme navn. */
  media: string;
};

/**
 * Baggrunden bag begge heroes: selvhostet klip med plakat, mørkt overlay til
 * læsbar tekst og en fade ned i sidens baggrund. Respekterer reduced motion.
 */
export default function HeroBackdrop({ media }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0">
      {reduceMotion ? (
        <Image src={`/${media}.jpg`} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <video key={media} autoPlay loop muted playsInline poster={`/${media}.jpg`} aria-hidden="true" className="w-full h-full object-cover">
          <source src={`/${media}.webm`} type="video/webm" />
          <source src={`/${media}.mp4`} type="video/mp4" />
        </video>
      )}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Brug den i `HeroSection`**

I `HeroSection.tsx`: fjern `useReducedMotion`- og `Image`-importerne (og `const reduceMotion`), importér `HeroBackdrop`, og erstat hele baggrundsblokken med:
```tsx
      <HeroBackdrop media={media} />
```
Behold kommentaren om selvhostet video ovenover — den forklarer stadig hvorfor.

- [ ] **Step 3: Skriv `FamilyHero`**

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Music } from "lucide-react";
import HeroBackdrop from "@/components/netflix/HeroBackdrop";

type Props = { media: string };

/** Forsiden for familie og venner: ønskelisten er hovedpersonen, ikke CV'et. */
export default function FamilyHero({ media }: Props) {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ height: "70vh" }}>
      <HeroBackdrop media={media} />

      <div className="relative z-10 px-5 md:px-16 lg:px-24 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: "#ec4899", fontFamily: "var(--font-body)" }}
        >
          Familie & venner
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-heading)", color: "var(--on-media)" }}
        >
          Ønskelisten
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl font-light max-w-xl mb-10 leading-relaxed"
          style={{ color: "var(--on-media-muted)", fontFamily: "var(--font-body)" }}
        >
          Reservér et ønske, så I ikke køber det samme. Jeg kan ikke se, hvem der har
          taget hvad — kun at det er taget. Log ind med Google eller få en kode på mail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="/family/wishlist"
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-opacity duration-200 hover:opacity-85"
            style={{ background: "var(--on-media)", color: "var(--on-media-ink)", fontFamily: "var(--font-body)" }}
          >
            <Gift size={16} />
            Se ønskelisten
          </Link>
          <Link
            href="/family/music"
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-colors duration-200"
            style={{
              background: "var(--on-media-tint)",
              color: "var(--on-media)",
              border: "1px solid var(--on-media-tint-strong)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Music size={16} />
            Hvad jeg hører
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: tsc**

Run: `npx tsc --noEmit`
Expected: kun de kendte fejl i `src/app/recruiter/page.tsx` og `src/app/developer/page.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/components/netflix/HeroBackdrop.tsx src/components/netflix/HeroSection.tsx src/components/netflix/FamilyHero.tsx
git commit -m "feat(hero): baggrund udtrukket til HeroBackdrop, ny FamilyHero"
```

---

### Task 4: `HomePage` drevet af profil-config

**Files:**
- Create: `src/components/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `PROFILES`, `cardHref`, `ProfileId`, `RowSpec` (Task 1); `CategoryCard` med `icon: IconName` (Task 2); `FamilyHero` (Task 3); `NetflixNav` med `profile: ProfileId` (ændres i Task 7 — indtil da fejler tsc her, det er forventet).
- Produces: `HomePage({ profile }: { profile: ProfileId })`.

- [ ] **Step 1: Skriv komponenten**

```tsx
import NetflixNav from "@/components/netflix/NetflixNav";
import HeroSection from "@/components/netflix/HeroSection";
import FamilyHero from "@/components/netflix/FamilyHero";
import ContentRow from "@/components/netflix/ContentRow";
import CategoryCard from "@/components/cards/CategoryCard";
import AnbefalingerCard from "@/components/cards/AnbefalingerCard";
import CertificationsCard from "@/components/cards/CertificationsCard";
import { PROFILES, cardHref, type ProfileId, type RowSpec } from "@/lib/profiles";

const EXTRAS = {
  anbefalinger: AnbefalingerCard,
  certifications: CertificationsCard,
} as const;

function Row({ row, profile }: { row: RowSpec; profile: ProfileId }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2
        className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {row.title}
      </h2>
      <ContentRow title="">
        {row.cards.map((card) => (
          <CategoryCard
            key={card.title}
            title={card.title}
            description={card.description}
            gradient={card.gradient}
            icon={card.icon}
            href={cardHref(card, profile)}
          />
        ))}
        {row.extras?.map((extra) => {
          const Extra = EXTRAS[extra];
          return <Extra key={extra} />;
        })}
      </ContentRow>
    </div>
  );
}

/** Forsiden for enhver profil — hvad den viser står i profiles.ts, ikke her. */
export default function HomePage({ profile }: { profile: ProfileId }) {
  const { label, heroMedia, home } = PROFILES[profile];

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <NetflixNav profile={profile} />
      {home.hero === "wishlist" ? (
        <FamilyHero media={heroMedia} />
      ) : (
        <HeroSection profileLabel={label} media={heroMedia} />
      )}

      <div className="pt-8 pb-24">
        {home.rows.map((row) => (
          <Row key={row.title} row={row} profile={profile} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit** (tsc fejler stadig på `NetflixNav`-props indtil Task 7 — commit alligevel, Task 7 lukker det)

```bash
git add src/components/pages/HomePage.tsx
git commit -m "feat(forside): HomePage drevet af profilens home-config"
```

---

### Task 5: `ContactPage` som komponent

**Files:**
- Create: `src/components/pages/ContactPage.tsx`

**Interfaces:**
- Produces: `ContactPage({ profile }: { profile: ProfileId })` — client-komponent.

- [ ] **Step 1: Flyt indholdet**

Kopiér hele `src/app/developer/contact/page.tsx` (den pæneste af de to, med kommentarer) til `src/components/pages/ContactPage.tsx` og ret kun disse linjer:

```tsx
"use client";

import SubPageLayout from "@/components/netflix/SubPageLayout";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { PROFILES, type ProfileId } from "@/lib/profiles";

const EMAIL = "frederik.meiner@gmail.com";

export default function ContactPage({ profile }: { profile: ProfileId }) {
  const { href, label } = PROFILES[profile];
  const [copied, setCopied] = useState(false);
  …
    <SubPageLayout title="" backHref={href} backLabel={label}>
```
Alt andet uændret.

- [ ] **Step 2: Commit**

```bash
git add src/components/pages/ContactPage.tsx
git commit -m "refactor(kontakt): kontaktsiden som komponent med profil-prop"
```

---

### Task 6: Dynamiske ruter `src/app/[profile]/…` — og slet kopierne

**Files:**
- Create: `src/app/[profile]/page.tsx`, `src/app/[profile]/{projects,skills,experience,inspiration,music,contact,wishlist}/page.tsx`
- Delete: `src/app/recruiter/**`, `src/app/developer/**`

**Interfaces:**
- Consumes: `profilesWithPage`, `isProfileId`, `hasPage`, `PROFILE_IDS` (Task 1); `HomePage` (Task 4); `ContactPage` (Task 5); eksisterende `ProjectsPage`, `SkillsPage`, `ExperiencePage`, `InspirationPage`, `MusicPage`, `WishlistPage` (alle tager `{ profile: ProfileId }`).

I Next 16 er `params` et Promise: `const { profile } = await params`. `dynamicParams = false` gør at ukendte segmenter giver 404 uden at siden kører.

- [ ] **Step 1: Forsiden `src/app/[profile]/page.tsx`**

```tsx
import HomePage from "@/components/pages/HomePage";
import { PROFILE_IDS, type ProfileId } from "@/lib/profiles";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROFILE_IDS.map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <HomePage profile={profile} />;
}
```

- [ ] **Step 2: De statiske undersider**

Samme mønster for `projects`, `skills`, `experience`, `inspiration`, `music`, `contact`. Metadata og komponent pr. side kopieres fra de gamle `src/app/recruiter/<side>/page.tsx`. Eksempel `src/app/[profile]/projects/page.tsx`:

```tsx
import type { Metadata } from "next";
import ProjectsPage from "@/components/pages/ProjectsPage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Projekter",
  description: "Udvalgte projekter — web, integrationer og AI-agenter.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("projects").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <ProjectsPage profile={profile} />;
}
```

De øvrige — kun `PageId`, komponent og metadata skifter:

| Fil | `profilesWithPage(…)` | Komponent | title / description |
|---|---|---|---|
| `skills/page.tsx` | `"skills"` | `SkillsPage` | "Skills" / "Teknologier og værktøjer jeg arbejder i til daglig." |
| `experience/page.tsx` | `"experience"` | `ExperiencePage` | "Erfaring" / "5+ års professionel webudvikling — fra junior til senior frontend developer." |
| `inspiration/page.tsx` | `"inspiration"` | `InspirationPage` | "Inspiration" / "Det jeg følger med i og henter inspiration fra." |
| `music/page.tsx` | `"music"` | `MusicPage` | "Musik" / "Hvad der spiller på Spotify lige nu." |
| `contact/page.tsx` | `"contact"` | `ContactPage` | "Kontakt" / "Skriv til mig — mail eller LinkedIn." |

- [ ] **Step 3: Ønskelisten `src/app/[profile]/wishlist/page.tsx`**

Den er `force-dynamic` (sessionen afgør indholdet), så `dynamicParams = false` beskytter ikke — tjek profilen selv:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WishlistPage from "@/components/pages/WishlistPage";
import { hasPage, isProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Ønskeliste",
  description: "Min ønskeliste — reservér et ønske, så andre kan se det er taget.",
  robots: { index: false, follow: false },
};

// Reservationer afhænger af den indloggede bruger — må aldrig caches.
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ profile: string }> }) {
  const { profile } = await params;
  if (!isProfileId(profile) || !hasPage(profile, "wishlist")) notFound();
  return <WishlistPage profile={profile} />;
}
```

- [ ] **Step 4: Slet de gamle mapper**

```bash
git rm -r src/app/recruiter src/app/developer
```

- [ ] **Step 5: tsc**

Run: `npx tsc --noEmit`
Expected: kun fejl om `NetflixNav`-props (`profile` findes ikke) fra `HomePage.tsx`. Task 7 retter det.

- [ ] **Step 6: Commit**

```bash
git add src/app
git commit -m "feat(ruter): én dynamisk [profile]-rute erstatter recruiter/ og developer/"
```

---

### Task 7: Profilvælger og `NetflixNav` læser fra `PROFILES`

**Files:**
- Modify: `src/app/page.tsx:8-11` (profillisten)
- Modify: `src/components/netflix/NetflixNav.tsx:10-20, 41, 79-86, 121-130`

**Interfaces:**
- Produces: `NetflixNav({ profile }: { profile: ProfileId })`.

- [ ] **Step 1: Profilvælgeren**

I `src/app/page.tsx`: fjern den lokale `profiles`-konstant og skriv:
```tsx
import { PROFILES, PROFILE_IDS } from "@/lib/profiles";

const profiles = PROFILE_IDS.map((id) => ({ id, ...PROFILES[id] }));
```
Resten (`profile.id`, `.label`, `.avatar`, `.color`) matcher allerede. `handleSelect` navigerer til `/${id}` — uændret.

Profilvælgeren viser tre avatarer i én række med `gap-8 md:gap-16`; på smalle skærme skal de kunne ombrydes: tilføj `flex-wrap justify-center` på den `motion.div`, der har `className="flex gap-8 md:gap-16"`.

- [ ] **Step 2: `NetflixNav`**

Erstat den lokale `profiles`-liste og props:
```tsx
import { PROFILES, PROFILE_IDS, type ProfileId } from "@/lib/profiles";

type Props = { profile: ProfileId };

export default function NetflixNav({ profile }: Props) {
  const { label: profileLabel, avatar: profileAvatar } = PROFILES[profile];
  …
  const others = PROFILE_IDS.filter((id) => id !== profile).map((id) => ({ id, ...PROFILES[id] }));
```
Brugen længere nede (`profileLabel`, `profileAvatar`, `p.id`, `p.href`, `p.avatar`, `p.label`) er uændret.

- [ ] **Step 3: tsc + lint + test**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: alt grønt — første gang siden Task 2.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/netflix/NetflixNav.tsx
git commit -m "refactor(nav): profilvælger og NetflixNav læser fra PROFILES"
```

---

### Task 8: Sitemap, session-proxy og redirects

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/proxy.ts:35-37` (matcher)
- Modify: `next.config.ts`

- [ ] **Step 1: Sitemap fra profilernes sider**

```ts
import type { MetadataRoute } from "next";
import { PROFILES, PROFILE_IDS } from "@/lib/profiles";

const SITE_URL = "https://frederikmeiner.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, priority: 1 },
    ...PROFILE_IDS.flatMap((profile) => [
      { url: `${SITE_URL}${PROFILES[profile].href}`, lastModified, priority: 0.8 },
      // Ønskelisten holdes ude med vilje — den er personlig og er sat til noindex.
      ...PROFILES[profile].pages
        .filter((page) => page !== "wishlist")
        .map((page) => ({ url: `${SITE_URL}${PROFILES[profile].href}/${page}`, lastModified, priority: 0.6 })),
    ]),
  ];
}
```

- [ ] **Step 2: Proxy-matcher**

I `src/proxy.ts`:
```ts
export const config = {
  matcher: ["/:profile/wishlist", "/auth/:path*"],
};
```

- [ ] **Step 3: Redirects**

I `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  images: { … uændret … },
  // Ønskelisten bor hos familie-profilen nu; gamle links skal stadig virke.
  async redirects() {
    return [
      { source: "/recruiter/wishlist", destination: "/family/wishlist", permanent: true },
      { source: "/developer/wishlist", destination: "/family/wishlist", permanent: true },
    ];
  },
};
```

- [ ] **Step 4: tsc + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: grønt.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/proxy.ts next.config.ts
git commit -m "feat(ruter): sitemap/proxy fra PROFILES, redirects for den flyttede ønskeliste"
```

---

### Task 9: Familie-avatar, fuld verifikation, push

**Files:**
- Create: `public/avatar-family.png` (genereret)

- [ ] **Step 1: Generér avataren med sharp** (er devDependency)

```bash
node -e '
const sharp = require("sharp");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#831843"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>
  <rect width="320" height="320" fill="url(#g)"/>
  <g transform="translate(64 64) scale(8)" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
  </g></svg>`;
sharp(Buffer.from(svg)).png().toFile("public/avatar-family.png").then(() => console.log("ok"));
'
```
Expected: `ok`, og `public/avatar-family.png` findes (~10 KB).

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Compiled successfully. Build-loggen viser `/[profile]`, `/[profile]/projects` osv. som statiske med de rigtige params — og `/[profile]/wishlist` som dynamisk.

- [ ] **Step 3: Kør prod-serveren og verificér ruterne**

```bash
(npx next start -p 3000 > "$TEMP/next.log" 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
for u in /developer /recruiter /family /family/wishlist /family/music /family/contact /developer/projects /recruiter/skills; do
  printf "%-22s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$u)"
done
printf "%-22s %s\n" "/family/projects" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/family/projects)"
printf "%-22s %s\n" "/admin" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/admin)"
curl -s -o /dev/null -w "/recruiter/wishlist -> %{http_code} %{redirect_url}\n" http://localhost:3000/recruiter/wishlist
curl -s http://localhost:3000/sitemap.xml | grep -o "frederikmeiner.com/family[^<]*"
curl -s http://localhost:3000/family | grep -o "Se ønskelisten" | head -1
```
Expected: alle første otte → `200`; `/family/projects` → `404`; `/admin` → `404`; redirect → `308 http://localhost:3000/family/wishlist`; sitemap indeholder `/family`, `/family/music`, `/family/contact` men ikke `/family/wishlist`; "Se ønskelisten" findes.

Stop serveren bagefter (PowerShell):
```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

- [ ] **Step 4: Commit og push**

```bash
git add public/avatar-family.png
git commit -m "feat(profiler): Familie & venner-profil med ønskelisten som forside"
git push origin main
```
Følg deployet: `gh run watch $(gh run list --workflow=Deploy --limit 1 --json databaseId -q '.[0].databaseId') --exit-status`. Gentag curl-tjekkene fra Step 3 mod `https://frederikmeiner.com`.

---

## Del B — titel-side til projekter

### Task 10: Queries: `getProject`, `getProjectSlugs`, `BentoItem.href`

**Files:**
- Modify: `src/lib/sanity/queries.ts:22-30, 66-74, 108-119`
- Modify: `src/components/pages/ProjectsPage.tsx`

**Interfaces:**
- Produces:
  ```ts
  export type BentoItem = { …; href?: string };            // internt link vinder over liveUrl
  export async function getProjectSlugs(): Promise<string[]>;
  export async function getProject(slug: string): Promise<Project | null>;
  export function projectsToBento(projects: Project[], basePath?: string): BentoItem[];
  ```

- [ ] **Step 1: Udvid `BentoItem`**

```ts
export type BentoItem = {
  _id: string;
  title: string;
  description?: string;
  image?: { asset: { url: string } };
  videoUrl?: string;
  liveUrl?: string;
  /** Internt link (titel-side). Sat → kortet linker hertil i stedet for liveUrl. */
  href?: string;
  size?: BentoSize;
};
```

- [ ] **Step 2: Nye queries** — indsæt efter `getFeaturedProjects`:

```ts
export async function getProjectSlugs(): Promise<string[]> {
  const rows = await client.fetch<{ slug: string }[]>(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  );
  return rows.map((r) => r.slug);
}

export async function getProject(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id, title, slug, description, featured, size, videoUrl, liveUrl, githubUrl, publishedAt,
      image { asset->{ url }, hotspot },
      technologies[]->{ _id, name, category }
    }`,
    { slug }
  );
}
```

- [ ] **Step 3: `projectsToBento` med basePath**

```ts
/**
 * Projekter → bento. Med `basePath` linker kortene til titel-siden
 * (`${basePath}/${slug}`) i stedet for direkte ud af sitet.
 * Falder tilbage til `featured` hvis `size` ikke er sat i Studio endnu.
 */
export function projectsToBento(projects: Project[], basePath?: string): BentoItem[] {
  return projects.map((p) => ({
    _id: p._id,
    title: p.title,
    description: p.description,
    image: p.image,
    videoUrl: p.videoUrl,
    liveUrl: p.liveUrl,
    href: basePath && p.slug?.current ? `${basePath}/${p.slug.current}` : undefined,
    size: p.size ?? (p.featured ? "large" : "normal"),
  }));
}
```

- [ ] **Step 4: `ProjectsPage` sender basePath**

I `src/components/pages/ProjectsPage.tsx`:
```tsx
  const { href, label } = PROFILES[profile];
  const items = projectsToBento(await getProjects(), `${href}/projects`);
```
(flyt `const { href, label }` op over `items`).

- [ ] **Step 5: tsc + lint, commit**

Run: `npx tsc --noEmit && npm run lint`
```bash
git add src/lib/sanity/queries.ts src/components/pages/ProjectsPage.tsx
git commit -m "feat(projekter): getProject/getProjectSlugs og interne bento-links"
```

---

### Task 11: `relatedProjects` — ren funktion med test

**Files:**
- Create: `src/lib/related-projects.ts`
- Create: `src/lib/related-projects.test.ts`

**Interfaces:**
- Produces: `relatedProjects<T extends ProjectLike>(current: T, all: T[], limit = 6): T[]` hvor `ProjectLike = { _id: string; featured?: boolean; publishedAt?: string; technologies?: { _id: string }[] }` (strukturelt kompatibel med `Project`).

- [ ] **Step 1: Skriv testen**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { relatedProjects } from "./related-projects.ts";

const t = (...ids: string[]) => ids.map((_id) => ({ _id }));
const a = { _id: "a", technologies: t("next", "ts", "sanity") };
const b = { _id: "b", technologies: t("next", "ts") };            // 2 fælles
const c = { _id: "c", technologies: t("next") };                  // 1 fælles
const d = { _id: "d", technologies: t("php") };                   // 0 fælles
const e = { _id: "e", featured: true, technologies: t("sanity") }; // 1 fælles, fremhævet
const f = { _id: "f", publishedAt: "2026-01-01", technologies: t("ts") }; // 1 fælles, nyere end c

test("rangerer efter antal fælles teknologier, udelader sig selv og nul-match", () => {
  const ids = relatedProjects(a, [a, b, c, d]).map((p) => p._id);
  assert.deepEqual(ids, ["b", "c"]);
});

test("uafgjort: fremhævet først, derefter nyeste dato", () => {
  const ids = relatedProjects(a, [a, c, e, f]).map((p) => p._id);
  assert.deepEqual(ids, ["e", "f", "c"]);
});

test("respekterer limit", () => {
  assert.equal(relatedProjects(a, [a, b, c, e, f], 2).length, 2);
});

test("tåler manglende technologies", () => {
  assert.deepEqual(relatedProjects({ _id: "x" }, [a, b]), []);
});
```

- [ ] **Step 2: Kør — skal fejle** (`npm test`: modulet findes ikke)

- [ ] **Step 3: Implementér**

```ts
/**
 * "Mere som dette": de projekter, der deler flest teknologier med det aktuelle.
 * Ren funktion — kører også i `node --test`.
 */
export type ProjectLike = {
  _id: string;
  featured?: boolean;
  publishedAt?: string;
  technologies?: { _id: string }[];
};

export function relatedProjects<T extends ProjectLike>(current: T, all: T[], limit = 6): T[] {
  const mine = new Set((current.technologies ?? []).map((t) => t._id));
  if (mine.size === 0) return [];

  return all
    .filter((p) => p._id !== current._id)
    .map((p) => ({ p, shared: (p.technologies ?? []).filter((t) => mine.has(t._id)).length }))
    .filter((x) => x.shared > 0)
    .sort(
      (x, y) =>
        y.shared - x.shared ||
        Number(Boolean(y.p.featured)) - Number(Boolean(x.p.featured)) ||
        (y.p.publishedAt ?? "").localeCompare(x.p.publishedAt ?? "")
    )
    .slice(0, limit)
    .map((x) => x.p);
}
```

- [ ] **Step 4: Kør — skal bestå** (`npm test`)

- [ ] **Step 5: Commit**

```bash
git add src/lib/related-projects.ts src/lib/related-projects.test.ts
git commit -m "feat(projekter): relatedProjects rangerer efter fælles teknologier"
```

---

### Task 12: `BentoCard` linker internt når `href` er sat

**Files:**
- Modify: `src/components/cards/BentoCard.tsx:1-8, 37-43, 165-176`

- [ ] **Step 1: Import og link-valg**

Øverst: `import Link from "next/link";`

I komponenten:
```tsx
  const internal = item.href;
  const external = internal ? undefined : item.liveUrl;
  const href = internal ?? external;
  const hostname = getHostname(external);
```
`hostname` vises kun for eksterne links — på et projektkort, der går til titel-siden, giver "danida.dk" nederst ingen mening.

- [ ] **Step 2: Render**

Erstat den afsluttende `return href ? (…) : (…)`:
```tsx
  const span = { gridColumn: `span ${col}`, gridRow: `span ${row}`, display: "block" } as const;

  if (internal) {
    return (
      <Link href={internal} style={span}>
        {card}
      </Link>
    );
  }
  return external ? (
    <a href={external} target="_blank" rel="noopener noreferrer" style={span}>
      {card}
    </a>
  ) : (
    <div style={span}>{card}</div>
  );
```

- [ ] **Step 3: tsc + lint, commit**

```bash
git add src/components/cards/BentoCard.tsx
git commit -m "feat(bento): kort linker til titel-siden når href er sat"
```

---

### Task 13: `SubPageLayout` med hero-slot, `ProjectCard`, `TitleHero`

**Files:**
- Modify: `src/components/netflix/SubPageLayout.tsx:9-16, 62-78`
- Create: `src/components/cards/ProjectCard.tsx`
- Create: `src/components/netflix/TitleHero.tsx`

**Interfaces:**
- Produces: `SubPageLayout` får `hero?: React.ReactNode` (rendres i fuld bredde over indholdet; `h1` udelades når `title` er tom). `ProjectCard({ project, href })`. `TitleHero({ project })`.

- [ ] **Step 1: `SubPageLayout`**

Props:
```tsx
type Props = {
  title: string;
  backHref: string;
  backLabel: string;
  /** Valgfri indholdsbredde, fx "1320px". Centrerer nav og indhold på samme akse. */
  maxWidth?: string;
  /** Fuldbredde-hero over indholdet (titel-sider). Indholdet starter så uden top-padding. */
  hero?: React.ReactNode;
  children: React.ReactNode;
};
```
Indholdsblokken:
```tsx
      {hero}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${hero ? "pt-6" : "pt-24"} pb-24 px-5 md:px-16`}
      >
        <div className="mx-auto w-full" style={{ maxWidth }}>
          {title && (
            <h1 className="text-3xl md:text-5xl font-bold mb-10" style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}>
              {title}
            </h1>
          )}
          {children}
        </div>
      </motion.div>
```
(`{title && …}` fjerner også den tomme `<h1>`, kontaktsiden rendrede før.)

- [ ] **Step 2: `ProjectCard`** — kort til rækker (samme mål som `CategoryCard`)

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import type { Project } from "@/lib/sanity/queries";

type Props = { project: Project; href: string };

export default function ProjectCard({ project, href }: Props) {
  const image = project.image?.asset.url;

  return (
    <Link href={href} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative rounded-xl overflow-hidden"
        style={{ width: 264, height: 168, background: "var(--surface-2)" }}
      >
        {image ? (
          <Image src={image} alt={project.title} fill sizes="264px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket size={40} color="var(--muted)" strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }} />
        <p className="absolute bottom-0 left-0 right-0 p-4 text-sm font-bold leading-tight" style={{ color: "#fff", fontFamily: "var(--font-heading)" }}>
          {project.title}
        </p>
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 3: `TitleHero`**

```tsx
import Image from "next/image";
import type { Project } from "@/lib/sanity/queries";

/** Toppen af en titel-side: projektets billede eller klip, med fade ned i siden. */
export default function TitleHero({ project }: { project: Project }) {
  const image = project.image?.asset.url;

  return (
    <section className="relative overflow-hidden" style={{ height: "60vh", minHeight: 360 }}>
      {project.videoUrl ? (
        <video src={project.videoUrl} poster={image} autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      ) : image ? (
        <Image src={image} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)" }} />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--background) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.35) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 px-5 md:px-16 pb-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}>
          {project.title}
        </h1>
      </div>
    </section>
  );
}
```
`TitleHero` er en server-komponent (ingen "use client") — den bruger hverken state eller motion.

- [ ] **Step 4: tsc + lint, commit**

```bash
git add src/components/netflix/SubPageLayout.tsx src/components/cards/ProjectCard.tsx src/components/netflix/TitleHero.tsx
git commit -m "feat(titelside): hero-slot i SubPageLayout, ProjectCard og TitleHero"
```

---

### Task 14: Titel-siden — komponent, rute, metadata, verifikation, push

**Files:**
- Create: `src/components/pages/ProjectTitlePage.tsx`
- Create: `src/app/[profile]/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProject`, `getProjects`, `getProjectSlugs` (Task 10); `relatedProjects` (Task 11); `SubPageLayout` med `hero` (Task 13); `ProjectCard`, `TitleHero` (Task 13); `ContentRow`; `profilesWithPage`, `PROFILES` (Task 1).

- [ ] **Step 1: `ProjectTitlePage`**

```tsx
import Link from "next/link";
import { ExternalLink, Github, Star } from "lucide-react";
import SubPageLayout from "@/components/netflix/SubPageLayout";
import TitleHero from "@/components/netflix/TitleHero";
import ContentRow from "@/components/netflix/ContentRow";
import ProjectCard from "@/components/cards/ProjectCard";
import { relatedProjects } from "@/lib/related-projects";
import { PROFILES, type ProfileId } from "@/lib/profiles";
import type { Project } from "@/lib/sanity/queries";

type Props = { profile: ProfileId; project: Project; all: Project[] };

const button = "flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-opacity duration-200 hover:opacity-85";

export default function ProjectTitlePage({ profile, project, all }: Props) {
  const base = `${PROFILES[profile].href}/projects`;
  const year = project.publishedAt ? new Date(project.publishedAt).getFullYear() : null;
  const tech = project.technologies ?? [];
  const related = relatedProjects(project, all);

  return (
    <SubPageLayout title="" backHref={base} backLabel="Projekter" hero={<TitleHero project={project} />} maxWidth="1100px">
      {/* Meta-linje — som Netflix' "2024 · 3 sæsoner · HD" */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
        {year && <li>{year}</li>}
        <li>{tech.length} {tech.length === 1 ? "teknologi" : "teknologier"}</li>
        {project.featured && (
          <li className="flex items-center gap-1" style={{ color: "var(--accent)" }}>
            <Star size={13} fill="currentColor" /> Fremhævet
          </li>
        )}
      </ul>

      <div className="flex flex-wrap gap-3 mb-8">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={button} style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-body)" }}>
            <ExternalLink size={16} /> Åbn
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={button} style={{ background: "var(--surface-2)", color: "var(--foreground)", border: "1px solid var(--border)", fontFamily: "var(--font-body)" }}>
            <Github size={16} /> Kode
          </a>
        )}
      </div>

      {project.description && (
        <p className="max-w-2xl text-base md:text-lg leading-relaxed mb-8" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
          {project.description}
        </p>
      )}

      {tech.length > 0 && (
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            Teknologier
          </p>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <Link key={t._id} href={`${PROFILES[profile].href}/skills`} className="rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-70" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        // ContentRow har sin egen side-padding; træk den ud til kanten af indholdet.
        <div className="-mx-5 md:-mx-16">
          <ContentRow title="Mere som dette">
            {related.map((p) => (
              <ProjectCard key={p._id} project={p} href={`${base}/${p.slug.current}`} />
            ))}
          </ContentRow>
        </div>
      )}
    </SubPageLayout>
  );
}
```
Tjek at `lucide-react` eksporterer `Github` (det gør version 1.x; hedder den `GithubIcon`, brug den).

- [ ] **Step 2: Ruten**

`src/app/[profile]/projects/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectTitlePage from "@/components/pages/ProjectTitlePage";
import { getProject, getProjects, getProjectSlugs } from "@/lib/sanity/queries";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

type Params = Promise<{ profile: ProfileId; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return profilesWithPage("projects").flatMap((profile) => slugs.map((slug) => ({ profile, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const image = project.image?.asset.url;
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description, images: image ? [{ url: image }] : undefined },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { profile, slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  return <ProjectTitlePage profile={profile} project={project} all={all} />;
}
```

- [ ] **Step 3: tsc + lint + test + build**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: grønt; build-loggen lister `/[profile]/projects/[slug]` med ét entry pr. projekt × 2 profiler.

- [ ] **Step 4: Verificér mod prod-serveren**

```bash
(npx next start -p 3000 > "$TEMP/next.log" 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
SLUG=$(node --env-file=.env -e 'const {createClient}=require("@sanity/client");createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,apiVersion:process.env.NEXT_PUBLIC_SANITY_API_VERSION,useCdn:true}).fetch(`*[_type=="project"][0].slug.current`).then(s=>console.log(s))')
echo "slug: $SLUG"
curl -s -o /dev/null -w "/developer/projects/$SLUG -> %{http_code}\n" "http://localhost:3000/developer/projects/$SLUG"
curl -s "http://localhost:3000/developer/projects/$SLUG" | grep -o "Mere som dette\|Teknologier" | sort -u
curl -s -o /dev/null -w "/family/projects/$SLUG -> %{http_code}\n" "http://localhost:3000/family/projects/$SLUG"
curl -s -o /dev/null -w "/developer/projects/findes-ikke -> %{http_code}\n" http://localhost:3000/developer/projects/findes-ikke
curl -s http://localhost:3000/developer/projects | grep -o "href=\"/developer/projects/[^\"]*\"" | head -3
```
Expected: `200`; "Teknologier" (og "Mere som dette" hvis projektet deler teknologier med andre); `404`; `404`; bento-kortene linker til `/developer/projects/<slug>`.

Stop serveren som i Task 9.

- [ ] **Step 5: Commit og push**

```bash
git add src/components/pages/ProjectTitlePage.tsx "src/app/[profile]/projects/[slug]/page.tsx"
git commit -m "feat(projekter): titel-side pr. projekt med 'Mere som dette'"
git push origin main
```
Følg deployet og åbn ét projekt på live.

---

## Del C — rigtig Continue Watching

### Task 15: `watch-history` — rene funktioner med test

**Files:**
- Create: `src/lib/watch-history.ts`
- Create: `src/lib/watch-history.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type WatchEntry = { href: string; title: string; image?: string; progress: number; at: number };
  export const WATCH_LIMIT = 8;
  export function recordVisit(list: WatchEntry[], entry: WatchEntry): WatchEntry[];
  export function storageKey(profile: string): string;          // "watch:<profile>"
  export function readHistory(profile: string): WatchEntry[];    // [] ved fejl/tomt
  export function writeHistory(profile: string, list: WatchEntry[]): void;
  ```

- [ ] **Step 1: Test**

```ts
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { WATCH_LIMIT, readHistory, recordVisit, storageKey, writeHistory, type WatchEntry } from "./watch-history.ts";

const e = (href: string, progress = 0, at = 1): WatchEntry => ({ href, title: href, progress, at });

test("nyt besøg lægges forrest", () => {
  const list = recordVisit([e("/a")], e("/b"));
  assert.deepEqual(list.map((x) => x.href), ["/b", "/a"]);
});

test("genbesøg flytter frem og beholder højeste progress", () => {
  const list = recordVisit([e("/a", 0.8, 1), e("/b")], e("/a", 0.3, 2));
  assert.equal(list[0].href, "/a");
  assert.equal(list[0].progress, 0.8);
  assert.equal(list[0].at, 2);
  assert.equal(list.length, 2);
});

test("progress klippes til 0..1", () => {
  assert.equal(recordVisit([], e("/a", 1.7))[0].progress, 1);
  assert.equal(recordVisit([], e("/a", -1))[0].progress, 0);
});

test("maks WATCH_LIMIT poster", () => {
  let list: WatchEntry[] = [];
  for (let i = 0; i < WATCH_LIMIT + 3; i++) list = recordVisit(list, e(`/${i}`));
  assert.equal(list.length, WATCH_LIMIT);
  assert.equal(list[0].href, `/${WATCH_LIMIT + 2}`);
});

test("storageKey er pr. profil", () => {
  assert.equal(storageKey("family"), "watch:family");
});

// localStorage findes ikke i node — en minimal attrap er nok til læs/skriv.
const store = new Map<string, string>();
beforeEach(() => store.clear());
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
};

test("read/write går gennem localStorage og tåler skrald", () => {
  assert.deepEqual(readHistory("family"), []);
  writeHistory("family", [e("/family/wishlist", 0.5)]);
  assert.equal(readHistory("family")[0].href, "/family/wishlist");
  store.set("watch:family", "{ikke json");
  assert.deepEqual(readHistory("family"), []);
});
```

- [ ] **Step 2: Kør — skal fejle** (`npm test`)

- [ ] **Step 3: Implementér**

```ts
/**
 * Continue Watching: hvad denne besøgende har åbnet, og hvor langt ned de kom.
 * Rene funktioner over en liste, plus tynde læs/skriv-hjælpere til localStorage.
 * Alt browser-adgang er i try/catch — private vinduer og blokeret storage kaster.
 */
export type WatchEntry = {
  href: string;
  title: string;
  image?: string;
  /** 0..1 — hvor langt ned på siden man nåede. */
  progress: number;
  /** Date.now() for seneste besøg. */
  at: number;
};

export const WATCH_LIMIT = 8;

const clamp = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

/** Upsert på href: nyeste forrest, progress kun opad, aldrig flere end WATCH_LIMIT. */
export function recordVisit(list: WatchEntry[], entry: WatchEntry): WatchEntry[] {
  const prev = list.find((e) => e.href === entry.href);
  const merged: WatchEntry = { ...entry, progress: clamp(Math.max(prev?.progress ?? 0, entry.progress)) };
  return [merged, ...list.filter((e) => e.href !== entry.href)].slice(0, WATCH_LIMIT);
}

export function storageKey(profile: string) {
  return `watch:${profile}`;
}

export function readHistory(profile: string): WatchEntry[] {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(profile));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as WatchEntry[]).filter((e) => typeof e?.href === "string") : [];
  } catch {
    return [];
  }
}

export function writeHistory(profile: string, list: WatchEntry[]) {
  try {
    globalThis.localStorage?.setItem(storageKey(profile), JSON.stringify(list));
  } catch {
    // Ingen storage — så ingen historik. Siden virker stadig.
  }
}
```

- [ ] **Step 4: Kør — skal bestå** (`npm test`)

- [ ] **Step 5: Commit**

```bash
git add src/lib/watch-history.ts src/lib/watch-history.test.ts
git commit -m "feat(historik): watch-history med upsert, progress og localStorage"
```

---

### Task 16: `TrackVisit` i `SubPageLayout`

**Files:**
- Create: `src/components/netflix/TrackVisit.tsx`
- Modify: `src/components/netflix/SubPageLayout.tsx` (props + montering)
- Modify: `src/components/pages/ProjectTitlePage.tsx`, `src/components/pages/ContactPage.tsx` (sender `trackTitle`)

**Interfaces:**
- Consumes: `recordVisit`, `readHistory`, `writeHistory` (Task 15); `isProfileId` (Task 1).
- Produces: `TrackVisit({ title, image? })`; `SubPageLayout` får `trackTitle?: string; trackImage?: string`.

- [ ] **Step 1: `TrackVisit`**

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isProfileId } from "@/lib/profiles";
import { readHistory, recordVisit, writeHistory } from "@/lib/watch-history";

type Props = { title: string; image?: string };

/** Usynlig. Registrerer besøget og opdaterer scroll-progress i historikken for profilen i URL'en. */
export default function TrackVisit({ title, image }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    const profile = pathname.split("/")[1];
    if (!isProfileId(profile)) return;

    const measure = () => {
      const total = document.documentElement.scrollHeight;
      return total <= 0 ? 1 : (window.scrollY + window.innerHeight) / total;
    };
    const save = () =>
      writeHistory(profile, recordVisit(readHistory(profile), { href: pathname, title, image, progress: measure(), at: Date.now() }));

    save();

    // Throttlet: højst én skrivning pr. 250 ms mens der scrolles.
    let timer: number | null = null;
    const onScroll = () => {
      if (timer !== null) return;
      timer = window.setTimeout(() => {
        timer = null;
        save();
      }, 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [pathname, title, image]);

  return null;
}
```

- [ ] **Step 2: Montér i `SubPageLayout`**

Props:
```tsx
  /** Navn i Continue Watching. Falder tilbage til `title`; sæt den når title er tom. */
  trackTitle?: string;
  /** Billede til kortet i Continue Watching (fx projektets). */
  trackImage?: string;
```
Lige inde i den yderste `<div>`:
```tsx
      <TrackVisit title={trackTitle ?? title} image={trackImage} />
```
Import: `import TrackVisit from "@/components/netflix/TrackVisit";`

- [ ] **Step 3: Titel-siden og kontaktsiden sender navn**

I `ProjectTitlePage.tsx` på `<SubPageLayout …>`: tilføj `trackTitle={project.title} trackImage={project.image?.asset.url}`.
I `ContactPage.tsx`: tilføj `trackTitle="Kontakt"`.

- [ ] **Step 4: tsc + lint + test, commit**

```bash
git add src/components/netflix/TrackVisit.tsx src/components/netflix/SubPageLayout.tsx src/components/pages/ProjectTitlePage.tsx src/components/pages/ContactPage.tsx
git commit -m "feat(historik): TrackVisit registrerer besøg og scroll-progress"
```

---

### Task 17: `ContinueWatchingRow` på forsiden, verifikation, push

**Files:**
- Create: `src/components/netflix/ContinueWatchingRow.tsx`
- Modify: `src/components/pages/HomePage.tsx` (rækken indsættes efter første række)

**Interfaces:**
- Consumes: `readHistory`, `WatchEntry` (Task 15); `PROFILES`, `cardHref`, `CardSpec` (Task 1); `CARD_ICONS` (Task 2); `ContentRow`.

- [ ] **Step 1: Komponenten**

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import ContentRow from "@/components/netflix/ContentRow";
import { CARD_ICONS } from "@/lib/card-icons";
import { PROFILES, cardHref, type CardSpec, type ProfileId } from "@/lib/profiles";
import { readHistory, type WatchEntry } from "@/lib/watch-history";

const NETFLIX_RED = "#e50914";

/** Finder forsidens kort for et href, så historikken kan låne dets farve og ikon. */
function findCard(profile: ProfileId, href: string): CardSpec | undefined {
  for (const row of PROFILES[profile].home.rows) {
    const hit = row.cards.find((card) => cardHref(card, profile) === href);
    if (hit) return hit;
  }
  return undefined;
}

function HistoryCard({ entry, profile }: { entry: WatchEntry; profile: ProfileId }) {
  const card = findCard(profile, entry.href);
  const Icon = card ? CARD_ICONS[card.icon] : Film;

  return (
    <Link href={entry.href} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative rounded-xl overflow-hidden"
        style={{ width: 264, height: 168, background: card?.gradient ?? "var(--surface-2)" }}
      >
        {entry.image && <Image src={entry.image} alt="" fill sizes="264px" className="object-cover" />}
        {!entry.image && (
          <div className="absolute -top-2 -right-2 opacity-[0.18] select-none pointer-events-none">
            <Icon size={110} color="white" strokeWidth={1} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 flex items-center gap-2">
          <Icon size={14} color="white" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <p className="text-sm font-bold leading-tight truncate" style={{ color: "#fff", fontFamily: "var(--font-heading)" }}>
            {entry.title}
          </p>
        </div>
        {/* Den røde bjælke — det eneste Netflix-element folk genkender med det samme */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: "rgba(255,255,255,0.25)" }}>
          <div style={{ height: "100%", width: `${Math.round(entry.progress * 100)}%`, background: NETFLIX_RED }} />
        </div>
      </motion.div>
    </Link>
  );
}

/** Besøgerens egen historik for profilen. Læses efter mount, så server og klient rendrer ens. */
export default function ContinueWatchingRow({ profile }: { profile: ProfileId }) {
  const [entries, setEntries] = useState<WatchEntry[]>([]);

  useEffect(() => {
    setEntries(readHistory(profile));
  }, [profile]);

  if (entries.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
        Continue Watching for {PROFILES[profile].label}
      </h2>
      <ContentRow title="">
        {entries.map((entry) => (
          <HistoryCard key={entry.href} entry={entry} profile={profile} />
        ))}
      </ContentRow>
    </div>
  );
}
```

- [ ] **Step 2: Ind på forsiden**

I `HomePage.tsx`: importér `ContinueWatchingRow` og rendér rækkerne sådan, at historikken kommer efter den første række:
```tsx
      <div className="pt-8 pb-24">
        {home.rows.map((row, i) => (
          <div key={row.title}>
            <Row row={row} profile={profile} />
            {i === 0 && <ContinueWatchingRow profile={profile} />}
          </div>
        ))}
      </div>
```

- [ ] **Step 3: tsc + lint + test + build**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: grønt.

- [ ] **Step 4: Verificér at forsiden er ren uden historik**

```bash
(npx next start -p 3000 > "$TEMP/next.log" 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -s http://localhost:3000/developer | grep -c "Continue Watching"
curl -s http://localhost:3000/developer | grep -c "Mere fra Frederik"
```
Expected: `0` (ingen historik server-side → rækken findes ikke i HTML'en) og `1`. Stop serveren som i Task 9.

Klik-testen (besøg to sider, gå til forsiden, se dem med rød bjælke) laver Frederik på live.

- [ ] **Step 5: Commit og push**

```bash
git add src/components/netflix/ContinueWatchingRow.tsx src/components/pages/HomePage.tsx
git commit -m "feat(forside): Continue Watching viser besøgerens egen historik"
git push origin main
```
Følg deployet.

---

## Selv-review (udført ved skrivning)

- **Spec-dækning:** A: profiles som data (T1), dynamisk rute (T6), HomePage (T4), FamilyHero (T3), ContactPage (T5), nav/profilvælger (T7), sitemap/proxy/redirects (T8), avatar + verifikation (T9). B: queries (T10), related (T11), bento-links (T12), layout/kort/hero (T13), side + rute + metadata (T14). C: watch-history (T15), TrackVisit (T16), række (T17).
- **Typer:** `ProfileId`, `PageId`, `IconName`, `CardSpec`, `RowSpec`, `HomeConfig`, `Profile` defineres i T1 og bruges uændret i T2, T4, T7, T8, T17. `BentoItem.href` (T10) bruges i T12. `WatchEntry` (T15) bruges i T16–17. `SubPageLayout.hero/trackTitle/trackImage` (T13/T16) bruges i T14/T16.
- **Afvigelse fra spec, bevidst:** `NetflixNav` tager `profile` (id) i stedet for label+avatar — det følger af at PROFILES er sandheden. Kontaktsiden bliver en komponent, fordi den ellers ikke kan læse `params` som client-side.
