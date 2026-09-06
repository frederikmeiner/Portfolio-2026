import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WishlistPage from "@/components/pages/WishlistPage";
import { hasPage, isProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Ønskeliste",
  description: "Min ønskeliste — reservér et ønske, så andre kan se det er taget.",
  robots: { index: false, follow: false },
};

// Reservationer afhænger af den indloggede bruger — må aldrig caches.
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ profile: string }> }) {
  const { profile } = await params;
  if (!isProfileId(profile) || !hasPage(profile, "wishlist")) notFound();
  return <WishlistPage profile={profile} />;
}
