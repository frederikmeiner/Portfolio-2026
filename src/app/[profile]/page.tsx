import HomePage from "@/components/pages/HomePage";
import { PROFILE_IDS, type ProfileId } from "@/lib/profiles";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROFILE_IDS.map((profile) => ({ profile }));
}

export default async function Page({ params }: { params: Promise<{ profile: ProfileId }> }) {
  const { profile } = await params;
  return <HomePage profile={profile} />;
}
