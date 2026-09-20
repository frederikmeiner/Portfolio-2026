/**
 * Lighthouse-loft til CI. Kører mod en server der allerede er startet:
 *
 *   npx next start -p 3100 &
 *   node scripts/lighthouse-check.mjs http://127.0.0.1:3100
 *
 * Lighthouse hentes med npx og står ikke i package.json — så serveren, der kun
 * skal bygge og køre sitet, slipper for at installere den ved hvert deploy.
 * Chrome lånes fra Playwright, som CI allerede har installeret til browser-testen.
 *
 * Hvad der fejler et build, og hvad der kun advarer:
 *  - Tilgængelighed SKAL være 100. Den er deterministisk, og den var 94–98, før
 *    den blev målt — landmærker, kontrast og aria-labels skrider stille.
 *  - Sidevægt har et loft pr. side. Også deterministisk, og det fanger den dyre
 *    fejl: at alle klip igen hentes på én gang.
 *  - Ydelse fejler ALDRIG et build, den advarer kun. Tallet svinger med maskinen:
 *    samme commit gav 91 lokalt og 55 på GitHubs runner. En grænse ville blokere
 *    deploys uden grund. De to ting ovenfor fanger de regressioner, der betyder noget.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:3100";

const PAGES = [
  { path: "/developer", maxKB: 1500 },
  // Klippene på skærmen hentes efter load og tæller med — loftet fanger "alle klip på én gang".
  { path: "/developer/projects", maxKB: 9000 },
  { path: "/developer/projects/kompositterrasse", maxKB: 1200 },
  { path: "/developer/skills", maxKB: 900 },
];
const PERF_WARN = 85;

const out = mkdtempSync(join(tmpdir(), "lh-"));
const failures = [];
const warnings = [];

for (const { path, maxKB } of PAGES) {
  const file = join(out, `${path.replace(/\W+/g, "_")}.json`);
  try {
    runLighthouse(base + path, file);
  } catch (error) {
    // På Windows fejler Lighthouse af og til EFTER rapporten er skrevet, når Chromes
    // temp-mappe ikke kan slettes (EPERM). Findes rapporten, er målingen god nok.
    if (!existsSync(file)) throw error;
  }

  const lhr = JSON.parse(readFileSync(file, "utf8"));
  const a11y = Math.round(lhr.categories.accessibility.score * 100);
  const perf = Math.round(lhr.categories.performance.score * 100);
  const kb = Math.round(lhr.audits["total-byte-weight"].numericValue / 1024);
  const lcp = lhr.audits["largest-contentful-paint"].displayValue;
  console.log(`${path.padEnd(40)} tilgængelighed ${a11y} · ydelse ${perf} · LCP ${lcp} · ${kb} KB`);

  if (a11y < 100) {
    const failing = Object.values(lhr.audits)
      .filter((x) => lhr.categories.accessibility.auditRefs.some((r) => r.id === x.id) && x.score === 0)
      .map((x) => x.id);
    failures.push(`${path}: tilgængelighed ${a11y} (${failing.join(", ")})`);
  }
  if (kb > maxKB) failures.push(`${path}: ${kb} KB er over loftet på ${maxKB} KB`);
  if (perf < PERF_WARN) warnings.push(`${path}: ydelse ${perf} (under ${PERF_WARN} — kan være maskinen)`);
}

rmSync(out, { recursive: true, force: true });

for (const w of warnings) console.log(`::warning::${w}`);
if (failures.length) {
  for (const f of failures) console.error(`::error::${f}`);
  process.exit(1);
}
console.log("Lighthouse-loftet er overholdt.");

function runLighthouse(url, file) {
  execFileSync(
    "npx",
    [
      "--yes",
      "lighthouse@12",
      url,
      "--quiet",
      "--output=json",
      `--output-path=${file}`,
      "--only-categories=performance,accessibility",
      `--chrome-path=${chromium.executablePath()}`,
      "--chrome-flags=--headless=new --no-sandbox",
    ],
    // shell: npx er en .cmd-fil på Windows.
    { stdio: ["ignore", "ignore", "inherit"], shell: process.platform === "win32" }
  );
}
