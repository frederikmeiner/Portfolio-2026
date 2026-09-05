# Deploy

Push til `main` deployer automatisk. Ikke andet.

```bash
git push origin main
```

GitHub Actions (`.github/workflows/deploy.yml`) SSH'er til VPS'en og kører deploy-scriptet. Det tager cirka to minutter. Følg med under repoets **Actions**-fane, eller:

```bash
gh run watch $(gh run list --workflow=Deploy --limit 1 --json databaseId -q '.[0].databaseId')
```

Skal du deploye uden en ny commit — fx efter en ændring på serveren — så tryk **Run workflow** under Actions, eller `gh workflow run Deploy --ref main`.

**Indhold kræver ikke deploy.** Ønsker, projekter, skills og erfaringer ligger i Sanity og er live i samme øjeblik de gemmes i Studio.

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
