import SubPageLayout from "@/components/netflix/SubPageLayout";
import BentoGrid from "@/components/cards/BentoGrid";
import { getProjects, projectsToBento } from "@/lib/sanity/queries";

export default async function RecruiterProjectsPage() {
  const items = projectsToBento(await getProjects());

  return (
    <SubPageLayout title="Projekter" backHref="/recruiter" backLabel="Rekrutterer">
      <BentoGrid items={items} emptyText="Tilføj projekter i Sanity Studio → /studio" />
    </SubPageLayout>
  );
}
