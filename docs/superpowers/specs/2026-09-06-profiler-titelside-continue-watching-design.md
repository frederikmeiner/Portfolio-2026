# Profiler som data, titel-side til projekter og rigtig Continue Watching

Dato: 2026-09-06 · Status: godkendt i chat, klar til plan

## Formål

Portfolioen efterligner Netflix. Tre ting mangler for at illusionen holder:

1. Siden reagerer ikke på den, der kigger — "Continue Watching" er en fast liste.
2. Projekter har ingen titel-side; et klik går direkte ud af sitet.
3. Ønskelisten (til familie og venner) bor under arbejdsprofilerne Rekrutterer/Udvikler.

Tre features, bygget i rækkefølgen A → B → C som tre selvstændige deploys.

## A. Profiler som data + dynamisk rute

### Problem i dag
- Hver underside findes som to filer (`src/app/recruiter/<side>/page.tsx` og `src/app/developer/<side>/page.tsx`), der kun adskiller sig ved profil-id'et.
- Profillisten står tre steder: `src/lib/profiles.ts`, `src/app/page.tsx` (profilvælger) og `src/components/netflix/NetflixNav.tsx`.
- En tredje profil ville koste 9 nye filer og tre lister at holde synkrone.

### Løsning
`src/lib/profiles.ts` er den eneste sandhed om en profil:

```ts
type Profile = {
  label: string;            // "Familie & venner"
  avatar: string;           // "/avatar-family.png"
  color: string;            // kantfarve i profilvælgeren
  heroMedia: string;        // basisnavn på hero-klip i /public
  pages: PageId[];          // hvilke undersider profilen har
  home: HomeConfig;         // hero-variant + rækker med kort
};
```

Profiler: `recruiter`, `developer` (uændret indhold, minus ønskeliste) og ny `family` med `pages: ["wishlist", "music", "contact"]`.

Ruter: `src/app/[profile]/page.tsx` og `src/app/[profile]/<side>/page.tsx` — én fil pr. side. `generateStaticParams` giver kun de profiler, der har siden; andre kombinationer svarer `notFound()`. Alle eksisterende URL'er bevares. `src/app/recruiter/**` og `src/app/developer/**` slettes.

Forsiden bliver én `HomePage`-komponent drevet af `home`-config. Familie-forsiden: hero om ønskelisten med knappen *Se ønskelisten*, rækker med Ønskeliste, Musik, Kontakt.

Ønskelisten findes kun på `/family/wishlist`. `next.config.ts` får permanente redirects fra `/recruiter/wishlist` og `/developer/wishlist`. Rekrutterer/Udvikler får et kort *"Ønskelisten — som case"* (Supabase, RLS, OTP-login) der linker til `/family/wishlist`.

Profilvælger, `NetflixNav`, `sitemap.ts` og `src/proxy.ts` (session-refresh matcher) læser alle fra `profiles.ts`. Sitemap udelader fortsat ønskelisten (noindex).

### Assets
- `public/avatar-family.png` — genereres (gave-ikon i sidens stil, samme mål som de andre avatarer).
- `heroMedia` for family peger på `hero-recruiter`, indtil et rigtigt klip ligger i `/public` som `hero-family.{webm,mp4,jpg}`.

## B. Titel-side til projekter

Rute `src/app/[profile]/projects/[slug]/page.tsx`, statisk genereret for alle projekt-slugs × profiler med `projects`.

Data: `getProject(slug)` (GROQ) og `relatedProjects(project, all)` — ren funktion, der rangerer øvrige projekter efter antal fælles teknologier (`technologies[]._id`), top 6, uafgjort brydes af `featured` og `publishedAt`.

Layout (Netflix' titelside):
- Hero: projektets billede, eller video (`videoUrl`, autoplay/muted/loop) hvis sat; gradient-fade ned i siden.
- Titel, meta-linje: år fra `publishedAt` · antal teknologier · "Fremhævet" hvis `featured`.
- Knapper: **▶ Åbn** (`liveUrl`) og **Kode** (`githubUrl`) — hver kun hvis feltet er sat.
- Beskrivelse, teknologi-chips (link til `/[profile]/skills`).
- Række **"Mere som dette"** via `ContentRow` med projektkort → andre titel-sider.
- Tilbage-link til `/[profile]/projects` via `SubPageLayout`.

`BentoItem` får `href`; projekt-bento linker til titel-siden i stedet for `liveUrl`. Inspiration-bento beholder eksterne links.

Metadata pr. projekt: `title`, `description`, `openGraph.images` = projektets billede.

Ingen "match %" — ingen data bag.

## C. Rigtig Continue Watching

`src/lib/watch-history.ts` — rene funktioner, ingen browser-afhængighed:

```ts
type WatchEntry = { href: string; title: string; image?: string; progress: number; at: number };
recordVisit(list, entry) => list      // upsert på href, nyeste først, maks 8, progress = max(gammel, ny)
```

Lagring: `localStorage["watch:<profile>"]`, JSON, alle læs/skriv i try/catch (privat vindue, blokeret storage).

`TrackVisit` (client, usynlig) monteres i `SubPageLayout` og på titel-siden med `{ profile, href, title, image? }`. Registrerer ved mount, opdaterer progress ved scroll (throttlet ~250 ms): `min(1, (scrollY + innerHeight) / scrollHeight)`.

`ContinueWatchingRow` (client) på forsiden: læser historikken for profilen efter mount; tom → rendrer intet. Kort: sidens gradient/ikon fra `home`-config (opslag på href) eller projektets billede; rød progress-bar i bunden (`var(--accent)` eller Netflix-rød). Den nuværende faste række omdøbes til *"Mere fra Frederik"*.

## Verifikation
- `npx tsc --noEmit`, `npm run lint`, `npm run build` grønne for hver del.
- Del A: curl af alle `/[profile]/<side>` → 200 for gyldige, 404 for `/family/projects`; redirects → 308 til `/family/wishlist`; sitemap indeholder `/family` men ikke wishlist.
- Del B: build-log viser statiske titel-sider; curl af én slug → 200 med titel i HTML; ukendt slug → 404.
- Del C: `watch-history` verificeres med et node-script mod de rene funktioner (upsert, rækkefølge, maks 8, progress kun opad). Klik-oplevelsen testes af Frederik på live.

## Uden for scope
Match-procent, "Min liste", søgning, hover-preview, DA/EN. Kan komme senere.
