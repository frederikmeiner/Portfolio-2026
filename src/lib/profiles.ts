/**
 * De to profiler siden kan ses igennem. Undersiderne under /recruiter og
 * /developer er ellers identiske, så alt hvad der adskiller dem bor her.
 */
export const PROFILES = {
  recruiter: { href: "/recruiter", label: "Rekrutterer" },
  developer: { href: "/developer", label: "Udvikler" },
} as const;

export type ProfileId = keyof typeof PROFILES;
