import type { Metadata } from "next";
import WishlistPage from "@/components/pages/WishlistPage";

export const metadata: Metadata = {
  title: "Ønskeliste",
  description: "Min ønskeliste — reservér et ønske, så andre kan se det er taget.",
  robots: { index: false, follow: false },
};

// Reservationer afhænger af den indloggede bruger — må aldrig caches.
export const dynamic = "force-dynamic";

export default function Page() {
  return <WishlistPage profile="developer" />;
}
