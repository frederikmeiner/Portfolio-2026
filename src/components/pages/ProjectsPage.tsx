import { Suspense } from "react";
import SubPageLayout from "@/components/netflix/SubPageLayout";
import BentoGrid from "@/components/cards/BentoGrid";
import ProjectsBrowser from "@/components/pages/ProjectsBrowser";
import { getProjects, projectsToBento } from "@/lib/sanity/queries";
import { countTechnologies } from "@/lib/tech-slug";
import { PROFILES, type ProfileId } from "@/lib/profiles";

export default async function ProjectsPage({ profile }: { profile: ProfileId }) {
  const { href, label } = PROFILES[profile];
  const projects = await getProjects();
  const items = projectsToBento(projects, `${href}/projects`);

  return (
    <SubPageLayout title="Projekter" backHref={href} backLabel={label}>
      {/* Filteret læser ?tech= i browseren. Suspense holder siden statisk: den
          byggede HTML er det ufiltrerede grid, og filteret tager over ved hydration. */}
      <Suspense fallback={<BentoGrid items={items} />}>
        <ProjectsBrowser items={items} techs={countTechnologies(projects)} />
      </Suspense>
    </SubPageLayout>
  );
}
