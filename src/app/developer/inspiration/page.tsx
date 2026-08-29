import SubPageLayout from "@/components/netflix/SubPageLayout";
import BentoGrid from "@/components/cards/BentoGrid";
import { getInspiration, inspirationToBento } from "@/lib/sanity/queries";

export default async function InspirationPage() {
  const items = inspirationToBento(await getInspiration());

  return (
    <SubPageLayout title="Inspiration" backHref="/developer" backLabel="Udvikler">
      <BentoGrid items={items} emptyText="Tilføj inspiration i Sanity Studio → /studio" />
    </SubPageLayout>
  );
}
