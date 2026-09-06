import SubPageLayout from "@/components/netflix/SubPageLayout";
import BentoGrid from "@/components/cards/BentoGrid";
import { getProjects, projectsToBento } from "@/lib/sanity/queries";
import { PROFILES, type ProfileId } from "@/lib/profiles";

export default async function ProjectsPage({ profile }: { profile: ProfileId }) {
  const { href, label } = PROFILES[profile];
  const items = projectsToBento(await getProjects(), `${href}/projects`);

  return (
    <SubPageLayout title="Projekter" backHref={href} backLabel={label}>
      <BentoGrid items={items} emptyText="Tilføj projekter i Sanity Studio → /studio" />
    </SubPageLayout>
  );
}
