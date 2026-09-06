import type { Metadata } from "next";
import MusicPage from "@/components/pages/MusicPage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Musik",
  description: "Hvad der spiller på Spotify lige nu.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("music").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <MusicPage profile={profile} />;
}
