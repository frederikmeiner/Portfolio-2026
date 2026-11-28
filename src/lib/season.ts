/**
 * Julesæsonen på familie-profilen. Holdes fri for React/Next, så den kan
 * testes med `node --test`.
 *
 * Datoen regnes i dansk tid — serveren kører i UTC, og ellers skiftede
 * temaet og nedtællingen en time for sent.
 */

type Ymd = { y: number; m: number; d: number };

function copenhagenDate(date: Date): Ymd {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Copenhagen",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

/** Fra 15. november til og med helligtrekonger (6. januar). */
export function isChristmasSeason(date: Date = new Date()): boolean {
  const { m, d } = copenhagenDate(date);
  return (m === 11 && d >= 15) || m === 12 || (m === 1 && d <= 6);
}

/** Hele dage til juleaften. 0 på juleaften, null når den er overstået i år. */
export function daysUntilChristmasEve(date: Date = new Date()): number | null {
  const { y, m, d } = copenhagenDate(date);
  const today = Date.UTC(y, m - 1, d);
  const eve = Date.UTC(y, 11, 24);
  if (today > eve) return null;
  return Math.round((eve - today) / 86_400_000);
}

/** Teksten til nedtællingen — eller null uden for november/december. */
export function christmasCountdown(date: Date = new Date()): string | null {
  const days = daysUntilChristmasEve(date);
  if (days === null) return null;
  if (days === 0) return "Det er juleaften i dag";
  if (days === 1) return "1 dag til juleaften";
  return `${days} dage til juleaften`;
}
