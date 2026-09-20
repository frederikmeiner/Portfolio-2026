import type { Metadata } from "next";
import BehindPage from "@/components/pages/BehindPage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Bag om siden",
  description: "Sådan er portfolioen bygget: arkitektur, valg og fravalg — og en fejl jeg lærte af.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("behind").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <BehindPage profile={profile} />;
}
