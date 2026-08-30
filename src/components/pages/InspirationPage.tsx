import SubPageLayout from "@/components/netflix/SubPageLayout";
import BentoGrid from "@/components/cards/BentoGrid";
import { getInspiration, inspirationToBento } from "@/lib/sanity/queries";
import { PROFILES, type ProfileId } from "@/lib/profiles";

export default async function InspirationPage({ profile }: { profile: ProfileId }) {
  const items = inspirationToBento(await getInspiration());
  const { href, label } = PROFILES[profile];

  return (
    <SubPageLayout title="Inspiration" backHref={href} backLabel={label}>
      <BentoGrid items={items} emptyText="Tilføj inspiration i Sanity Studio → /studio" />
    </SubPageLayout>
  );
}
