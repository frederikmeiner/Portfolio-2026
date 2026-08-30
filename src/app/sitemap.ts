import type { MetadataRoute } from "next";
import { PROFILES } from "@/lib/profiles";

const SITE_URL = "https://frederikmeiner.com";

// Ønskelisten holdes ude med vilje — den er personlig og er sat til noindex.
const SUBPAGES = ["projects", "skills", "experience", "inspiration", "music", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, priority: 1 },
    ...Object.keys(PROFILES).flatMap((profile) => [
      { url: `${SITE_URL}/${profile}`, lastModified, priority: 0.8 },
      ...SUBPAGES.map((page) => ({
        url: `${SITE_URL}/${profile}/${page}`,
        lastModified,
        priority: 0.6,
      })),
    ]),
  ];
}
