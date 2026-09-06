import type { Metadata } from "next";
import ContactPage from "@/components/pages/ContactPage";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skriv til mig — mail eller LinkedIn.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return profilesWithPage("contact").map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <ContactPage profile={profile} />;
}
