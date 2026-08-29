import SubPageLayout from "@/components/netflix/SubPageLayout";
import BentoGrid from "@/components/cards/BentoGrid";
import { getProjects, projectsToBento } from "@/lib/sanity/queries";

export default async function DeveloperProjectsPage() {
  const items = projectsToBento(await getProjects());

  return (
    <SubPageLayout title="Projekter" backHref="/developer" backLabel="Udvikler">
      <BentoGrid items={items} emptyText="Tilføj projekter i Sanity Studio → /studio" />
    </SubPageLayout>
  );
}
