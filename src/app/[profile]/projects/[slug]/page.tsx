import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectTitlePage from "@/components/pages/ProjectTitlePage";
import { getProject, getProjects, getProjectSlugs } from "@/lib/sanity/queries";
import { hasPage, isProfileId, profilesWithPage } from "@/lib/profiles";

type Params = Promise<{ profile: string; slug: string }>;

// Slugs fra build'et er kun en forvarmning. Projekter oprettet i Sanity bagefter
// skal også virke uden deploy — oversigten viser dem efter et minut, og med
// dynamicParams = false pegede deres kort på en 404. Ukendte profiler og slugs
// afvises i stedet i selve siden.

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return profilesWithPage("projects").flatMap((profile) => slugs.map((slug) => ({ profile, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  // Billedet til delekortet kommer fra opengraph-image.tsx ved siden af.
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { profile, slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project || !isProfileId(profile) || !hasPage(profile, "projects")) notFound();
  return <ProjectTitlePage profile={profile} project={project} all={all} />;
}
