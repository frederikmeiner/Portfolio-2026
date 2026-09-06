import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "skillicons.dev" },
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },
  // Ønskelisten bor hos familie-profilen nu; gamle links skal stadig virke.
  async redirects() {
    return [
      { source: "/recruiter/wishlist", destination: "/family/wishlist", permanent: true },
      { source: "/developer/wishlist", destination: "/family/wishlist", permanent: true },
    ];
  },
};

export default nextConfig;
