import type { Metadata } from "next";
import InspirationPage from "@/components/pages/InspirationPage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Inspiration",
  description: "Det jeg følger med i og henter inspiration fra.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("inspiration").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <InspirationPage profile={profile} />;
}
