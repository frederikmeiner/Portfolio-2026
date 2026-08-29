import SubPageLayout from "@/components/netflix/SubPageLayout";
import BentoGrid from "@/components/cards/BentoGrid";
import { getInspiration, inspirationToBento } from "@/lib/sanity/queries";

export default async function RecruiterInspirationPage() {
  const items = inspirationToBento(await getInspiration());

  return (
    <SubPageLayout title="Inspiration" backHref="/recruiter" backLabel="Rekrutterer">
      <BentoGrid items={items} emptyText="Tilføj inspiration i Sanity Studio → /studio" />
    </SubPageLayout>
  );
}
