# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

Seed scripts (run from project root):
```bash
node --env-file=.env --env-file=.env.local scripts/seed.mjs           # Skills + projekter
node --env-file=.env --env-file=.env.local scripts/seed-experience.mjs # Erfaringer
```

Python til ui-ux-pro-max design system generator (Python ikke på PATH — brug `uv run python`):
```bash
uv run python .claude/skills/ui-ux-pro-max/scripts/search.py "portfolio" --design-system -p "Navn" -f markdown
```

## Stack

- **Next.js 16** (App Router, Turbopack, TypeScript)
- **Tailwind CSS v4** — konfigureres via `@theme inline` i `globals.css`, ikke `tailwind.config`
- **Sanity v3** — headless CMS, Studio tilgængeligt på `/studio`
- **next-sanity** — klient og Studio-integration

## Arkitektur

### Sanity

`src/sanity/client.ts` — singleton klient, bruges i Server Components og seed-scripts.  
`src/sanity/image.ts` — `urlFor()` helper til `@sanity/image-url`.  
`src/sanity/schemas/` — tre document types: `skill`, `project`, `experience`.

**Relationer:** `project.technologies` og `experience.technologies` er begge arrays af references til `skill`-dokumenter.

Sanity Studio kører embedded i Next.js på `/studio` via `src/app/studio/[[...tool]]/page.tsx` og `sanity.config.ts` i roden.

### Miljøvariabler

`.env` — public variabler (commites):
- `NEXT_PUBLIC_SANITY_PROJECT_ID=er2djct5`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2025-05-23`

`.env.local` — secret (commites ikke):
- `SANITY_API_TOKEN` — Developer token

### Design system

UI UX Pro Max skill er installeret i `.claude/skills/ui-ux-pro-max/`. Anbefalet design system for portfolioen:
- **Style:** Vibrant & Block-based
- **Farver:** Primary `#18181B`, Background `#FAFAFA`, CTA `#2563EB`
- **Fonte:** Archivo (headings) + Space Grotesk (body) via Google Fonts
- **Layout:** Hero → Projekt Grid (Masonry) → About → Contact

### Graphify

Graphify er installeret globalt (`uv tool install graphifyy`) og registreret som Claude Code skill.

```bash
graphify .                  # Generer knowledge graph over projektet
graphify claude install     # Aktivér auto-graph lookup før søgninger
```

Output lander i `graphify-out/`: `graph.html` (interaktiv), `GRAPH_REPORT.md` (overblik), `graph.json` (querybar).  
Kør `graphify .` igen når kodebasen har vokset sig stor nok til at grafen giver mening.

### Windows-specifikke noter

- Long paths aktiveret i registry (krævet af Sanity's dybe node_modules)
- Python er ikke på PATH — brug `uv run python` til alle Python-scripts
- CORS for `http://localhost:3000` er whitelistet i Sanity projektet
