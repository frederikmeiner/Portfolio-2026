import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectTitlePage from "@/components/pages/ProjectTitlePage";
import { getProject, getProjects, getProjectSlugs } from "@/lib/sanity/queries";
import { profilesWithPage, type ProfileId } from "@/lib/profiles";

type Params = Promise<{ profile: ProfileId; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return profilesWithPage("projects").flatMap((profile) => slugs.map((slug) => ({ profile, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const image = project.image?.asset.url;
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { profile, slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  return <ProjectTitlePage profile={profile} project={project} all={all} />;
}
