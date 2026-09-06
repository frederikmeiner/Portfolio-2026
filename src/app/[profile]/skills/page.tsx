import type { Metadata } from "next";
import SkillsPage from "@/components/pages/SkillsPage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Skills",
  description: "Teknologier og værktøjer jeg arbejder i til daglig.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("skills").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <SkillsPage profile={profile} />;
}
