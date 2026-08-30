import type { MetadataRoute } from "next";

const SITE_URL = "https://frederikmeiner.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Studio og ønskeliste er ikke offentligt indhold.
      disallow: ["/studio", "/api/", "/auth/", "/recruiter/wishlist", "/developer/wishlist"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
