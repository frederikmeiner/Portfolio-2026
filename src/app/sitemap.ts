import type { MetadataRoute } from "next";
import { PROFILES, PROFILE_IDS } from "@/lib/profiles";

const SITE_URL = "https://frederikmeiner.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, priority: 1 },
    ...PROFILE_IDS.flatMap((profile) => [
      { url: `${SITE_URL}${PROFILES[profile].href}`, lastModified, priority: 0.8 },
      // Ønskelisten holdes ude med vilje — den er personlig og er sat til noindex.
      ...PROFILES[profile].pages
        .filter((page) => page !== "wishlist")
        .map((page) => ({ url: `${SITE_URL}${PROFILES[profile].href}/${page}`, lastModified, priority: 0.6 })),
    ]),
  ];
}
