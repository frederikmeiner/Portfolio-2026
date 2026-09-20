# Deploy

Push til `main` deployer automatisk. Ikke andet.

```bash
git push origin main
```

GitHub Actions (`.github/workflows/deploy.yml`) kører først jobbet `check` — lint, typer, unit-tests, build og en browser-test — og kun hvis det er grønt, SSH'er `deploy` til VPS'en og kører deploy-scriptet. Det tager cirka fem minutter i alt. Følg med under repoets **Actions**-fane, eller:

```bash
gh run watch $(gh run list --workflow=Deploy --limit 1 --json databaseId -q '.[0].databaseId')
```

Skal du deploye uden en ny commit — fx efter en ændring på serveren — så tryk **Run workflow** under Actions, eller `gh workflow run Deploy --ref main`.

**Indhold kræver ikke deploy.** Ønsker, projekter, skills og erfaringer ligger i Sanity og er live senest et minut efter de gemmes i Studio (siderne regenereres med `revalidate = 60` i `src/app/[profile]/layout.tsx`). Uden den værdi ville Next cache Sanity-svarene i `.next/cache` med et års levetid — og den mappe overlever deploys, så selv et nyt build viste gammelt indhold.

## Tjekket før deploy

Kør det samme lokalt, før du pusher:

```bash
npm run lint && npm run typecheck && npm test
```

Browser-testen (`e2e/`) logger ind på ønskelisten med engangskode mod en falsk Supabase (`e2e/mock-supabase.mjs`) og tjekker, at reservationerne vises uden genindlæsning. Den skal bruge et build lavet med mock-adressen, fordi `NEXT_PUBLIC_`-værdier bages ind ved build:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54999 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_e2e npm run build
npm run test:e2e
```

Byg igen uden de to variabler bagefter, hvis du vil køre `npm start` lokalt mod den rigtige Supabase. Fejler testen i CI, ligger Playwright-sporet som artefakten `playwright-spor` på kørslen.

## Hvad der sker på serveren

Selve trinnene ligger i `/usr/local/sbin/deploy-portfolio-2026.sh` på VPS'en, ejet af root med `0700`:

```sh
cd /home/frederikmeiner3/htdocs/frederikmeiner.com
git fetch origin main
git reset --hard origin/main
npm ci
npm run build
pm2 restart portfolio-2026 --update-env
```

`reset --hard` og `npm ci` er bevidste valg: serveren tvinges til at matche `main`, og lockfilen røres aldrig. Tidligere gav `git pull` + `npm install` lokal drift i `package-lock.json`, som så blokerede næste deploy.

**Scriptet ligger uden for repoet med vilje.** SSH-nøglen i serverens `authorized_keys` er låst med `command="…",restrict`, så GitHub udelukkende kan udløse dét script — ikke få shell på maskinen. Lå scriptet i `scripts/`, kunne et push ændre præcis den kode root udfører, og forced command'en ville være meningsløs.

Prisen: ændres deploy-trinnene, skal scriptet redigeres på serveren. Det kan ikke gøres med et push.

## Hvad der stadig er manuelt

- **`.env` på serveren.** Nye miljøvariabler skal lægges derover i hånden. Filen er gitignored.
- **Deploy-scriptet.** Se ovenfor.

## Når noget fejler

Workflow'et fejler næsten altid med `exit code 255`, som ikke i sig selv siger noget. Læs den rigtige fejl med:

```bash
gh run view <run-id> --log-failed
```

| Fejl i loggen | Årsag |
|---|---|
| `Host key verification failed` | `VPS_KNOWN_HOST`-secreten mangler eller er tom. En secret der ikke findes bliver til en tom streng — helt uden fejl. |
| `Permission denied (publickey)` | Deploy-nøglen står ikke som sin egen linje i serverens `/root/.ssh/authorized_keys`. Tjek med `ssh-keygen -lf /root/.ssh/authorized_keys` at `github-actions-portfolio-2026` er der. Filen slutter uden linjeskift, så et rent `>>` klistrer den nye nøgle bag på den forrige linjes kommentar. |
| `node: not found` / `pm2: not found` | Deploy-scriptets `PATH` rammer ikke node-installationen. |

Workflow'et logger deploy-nøglens fingerprint ved hver kørsel. Matcher det nøglen på serveren, ligger fejlen i `authorized_keys`, ikke i secreten.

Secret-navnet er `VPS_KNOWN_HOST` — uden `s` til sidst — mens env-variablen i workflow'et hedder `VPS_KNOWN_HOSTS`. Retter du det ene, skal det andet følge med.
