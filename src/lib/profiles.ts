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

const ALL_PAGES: PageId[] = ["projects", "skills", "experience", "inspiration", "music", "contact", "wishlist"];

/**
 * Arbejdsrækkerne er ens for alle profiler — kun overskriften nævner profilen.
 * Ønskelisten er med som case for dem, der ikke har den som forside.
 */
function workRows(label: string, withWishlistCase: boolean): RowSpec[] {
  return [
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
          ...(withWishlistCase
            ? [{ title: "Ønskelisten — som case", description: "Supabase, RLS der skjuler reservationer for ejeren, login med Google eller engangskode", href: "/family/wishlist", gradient: G.pink, icon: "gift" } satisfies CardSpec]
            : []),
        ],
        extras: ["certifications"],
      },
  ];
}

function workHome(label: string): HomeConfig {
  return { hero: "work", rows: workRows(label, true) };
}

export const PROFILES: Record<ProfileId, Profile> = {
  developer: {
    href: "/developer",
    label: "Udvikler",
    avatar: "/avatar-developer.png",
    color: "#2563eb",
    heroMedia: "hero-developer",
    pages: ALL_PAGES.filter((p) => p !== "wishlist"),
    home: workHome("Udvikler"),
  },
  recruiter: {
    href: "/recruiter",
    label: "Rekrutterer",
    avatar: "/avatar-recruiter.png",
    color: "#16a34a",
    heroMedia: "hero-recruiter",
    pages: ALL_PAGES.filter((p) => p !== "wishlist"),
    home: workHome("Rekrutterer"),
  },
  family: {
    href: "/family",
    label: "Familie & venner",
    avatar: "/avatar-family.png",
    color: "#ec4899",
    // Genbruger rekrutterer-klippet indtil hero-family.{webm,mp4,jpg} ligger i /public.
    heroMedia: "hero-recruiter",
    // Samme sider som de andre — ønskelisten er bare forsiden og første række.
    pages: ALL_PAGES,
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
        ...workRows("Familie & venner", false),
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
