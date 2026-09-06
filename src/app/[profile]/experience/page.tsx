import type { Metadata } from "next";
import ExperiencePage from "@/components/pages/ExperiencePage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Erfaring",
  description: "5+ års professionel webudvikling — fra junior til senior frontend developer.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("experience").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <ExperiencePage profile={profile} />;
}
