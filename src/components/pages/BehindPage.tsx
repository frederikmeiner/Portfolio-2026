import Link from "next/link";
import SubPageLayout from "@/components/netflix/SubPageLayout";
import { PROFILES, type ProfileId } from "@/lib/profiles";

type Section = {
  kicker: string;
  title: string;
  body: string[];
  /** Et lille udsnit af den rigtige kode, når det forklarer mere end teksten. */
  code?: string;
};

const STACK = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Sanity", "Supabase", "Framer Motion", "GitHub Actions"];

const SECTIONS: Section[] = [
  {
    kicker: "Idéen",
    title: "Samme indhold, tre indgange",
    body: [
      "En rekrutterer, en udvikler og min familie leder ikke efter det samme. Netflix løser det med profiler, så det gør siden også: indholdet er det samme, men forsiden, rækkerne og tonen skifter med den profil, du vælger.",
      "Alt om profilerne står ét sted. Ruter, navigation, profilvælger, sitemap og forsider læser fra den samme fil, så en ny profil er én post — ikke en rundtur i ti komponenter. Filen er holdt fri for React, så reglerne kan testes med Nodes indbyggede test-runner.",
    ],
    code: `export const PROFILES: Record<ProfileId, Profile> = {
  developer: { href: "/developer", label: "Udvikler", pages: [...], home: workHome("Udvikler") },
  recruiter: { href: "/recruiter", label: "Rekrutterer", pages: [...], home: workHome("Rekrutterer") },
  family:    { href: "/family", label: "Familie & venner", pages: ALL_PAGES, home: { hero: "wishlist", ... } },
};`,
  },
  {
    kicker: "Indhold",
    title: "Nyt indhold uden deploy",
    body: [
      "Projekter, erfaring og kompetencer ligger i Sanity. Siderne er statiske, men regenereres i baggrunden hvert minut, så et nyt projekt i Studio er live uden at jeg rører koden.",
      "Det lyder som en standardindstilling, men den kom af en fejl: Sanity-svarene lå i Nexts data-cache med et års levetid, og den cache overlevede deploys på serveren. Nye projekter dukkede simpelthen aldrig op. Projektsiderne bygges desuden ved første besøg, så et nyt projekt ikke peger på en 404, indtil næste build.",
    ],
  },
  {
    kicker: "Ønskelisten",
    title: "Overraskelsen er beskyttet i databasen",
    body: [
      "Ønskelisten er sidens mest alvorlige stykke kode. Gæster logger ind og reserverer et ønske, så to ikke køber det samme — men jeg må ikke kunne se, hvad der er reserveret. Ellers er der ingen overraskelse.",
      "Det er ikke bare skjult i brugerfladen. Row Level Security sørger for, at man kun kan læse sine egne reservationer. Hvilke ønsker der er taget, udleveres af én databasefunktion, som kun returnerer ønskets id — aldrig hvem — og som returnerer ingenting, når det er mig, der spørger.",
      "Login er Google eller en sekscifret engangskode på mail. Kode frem for link er et bevidst valg: Outlooks linkscanner åbner engangslinks, før modtageren når at klikke, og så er linket brugt.",
    ],
    code: `create or replace function public.reserved_wish_ids()
returns setof text
language sql security definer stable
as $$
  select wish_id from public.reservations
  where not (public.wishlist_hide_from_owner() and public.is_wishlist_owner())
$$;`,
  },
  {
    kicker: "En fejl jeg lærte af",
    title: "Login virkede — siden opdagede det bare ikke",
    body: [
      "Efter login med engangskode så ønskelisten ud, som om intet var reserveret. Først efter en genindlæsning stod tallene rigtigt. Login-koden var fin, og serveren sendte de rigtige data. Fejlen lå et helt tredje sted.",
      "Komponenten kopierede serverens lister over i useState. En useState-initializer kører kun, når komponenten mountes, og router.refresh() mounter ikke noget på ny — den giver bare den eksisterende komponent nye props. De friske lister blev altså leveret og ignoreret. Alt, der blev beregnet direkte fra props, opdaterede sig fint, og derfor lignede det en login-fejl.",
      "Rettelsen er et fingeraftryk af serverens data: når det ændrer sig, overtager de nye lister under selve renderen. Læringen er den gamle: kopier ikke props til state, medmindre du også har besluttet, hvem der vinder, når de ændrer sig.",
    ],
    code: `const serverState = \`\${reservedIds.join()}|\${myIds.join()}\`;
const [synced, setSynced] = useState(serverState);
if (synced !== serverState) {
  setSynced(serverState);
  setReserved(new Set(reservedIds));
  setMine(new Set(myIds));
}`,
  },
  {
    kicker: "Detaljerne",
    title: "Det man ikke ser, når det virker",
    body: [
      "\"Fortsæt hvor du slap\" bor i browserens localStorage, men læses gennem useSyncExternalStore med en tom server-snapshot. Serveren og første klient-render er dermed ens for alle, og rækken dukker op uden hydration-fejl.",
      "Temaet sættes af et lille inline-script, før browseren maler første frame, så man aldrig ser et glimt af det forkerte tema. Fontene ligger på mit eget domæne og preloades med siden i stedet for at blive hentet gennem en kæde af kald til Google.",
      "Spotify-data huskes i serverprocessen. Nexts fetch-cache har Authorization-headeren med i nøglen, og med et nyt token ved hvert kald ramte den aldrig — den skrev bare en ny fil til disken, hver gang afspilleren spurgte. Top 10-rækken på forsiden er rangeret efter rigtige visninger, talt én gang pr. besøg gennem en databasefunktion, som er den eneste vej ind til tabellen.",
    ],
  },
  {
    kicker: "Drift",
    title: "Push til main er deploy",
    body: [
      "Siden kører på en VPS bag nginx. Et push til main starter en GitHub Action, som logger ind på serveren og bygger. Det er bevidst enkelt: ingen platform imellem, og jeg ved præcis, hvad der kører hvor.",
      "Foran deployet står en port: lint, typetjek, unit-tests, build og en browser-test skal være grønne, før noget når serveren. Browser-testen logger ind på ønskelisten mod en falsk Supabase og kræver, at reservationerne vises uden genindlæsning — den bliver rød, hvis rettelsen ovenfor fjernes.",
    ],
  },
];

/** Portfolioen som sin egen case: hvorfor den er bygget, som den er. */
export default function BehindPage({ profile }: { profile: ProfileId }) {
  const { href, label } = PROFILES[profile];

  return (
    <SubPageLayout title="Bag om siden" backHref={href} backLabel={label} maxWidth="860px">
      {/* Overskriften tegnes af SubPageLayout. */}
      <header className="-mt-4 mb-14">
        <p
          className="max-w-2xl text-base leading-relaxed md:text-lg"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Portfolioen er selv et projekt. Her er arkitekturen, de valg jeg traf undervejs — og en fejl, der lærte mig
          noget.
        </p>
        <ul className="mt-7 flex flex-wrap gap-2">
          {STACK.map((name) => (
            <li
              key={name}
              className="rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontFamily: "var(--font-body)",
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      </header>

      <div className="flex flex-col gap-16">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--accent-text)", fontFamily: "var(--font-body)" }}
            >
              {section.kicker}
            </p>
            <h2
              className="mb-5 text-2xl font-bold leading-snug md:text-3xl"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
            >
              {section.title}
            </h2>
            <div className="flex flex-col gap-4">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-base leading-relaxed"
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", opacity: 0.88 }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {section.code && (
              // Koden er bredere end en telefon — den scroller selv, ikke hele siden.
              <pre
                className="mt-6 overflow-x-auto rounded-xl p-5 text-[0.8rem] leading-relaxed"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                }}
              >
                <code>{section.code}</code>
              </pre>
            )}
          </section>
        ))}
      </div>

      <div
        className="mt-16 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          Vil du se ønskelisten i praksis, eller høre mere om valgene?
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/family/wishlist"
            className="rounded px-5 py-2.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
            }}
          >
            Se ønskelisten
          </Link>
          <Link
            href={`${href}/contact`}
            className="rounded px-5 py-2.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
            style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-body)" }}
          >
            Skriv til mig
          </Link>
        </div>
      </div>
    </SubPageLayout>
  );
}
