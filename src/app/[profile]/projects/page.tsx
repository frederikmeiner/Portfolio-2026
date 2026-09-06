import type { Metadata } from "next";
import ProjectsPage from "@/components/pages/ProjectsPage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Projekter",
  description: "Udvalgte projekter — web, integrationer og AI-agenter.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("projects").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <ProjectsPage profile={profile} />;
}
