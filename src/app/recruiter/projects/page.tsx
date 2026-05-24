import SubPageLayout from "@/components/netflix/SubPageLayout";
import ProjectCard from "@/components/cards/ProjectCard";
import { getProjects } from "@/lib/sanity/queries";

export default async function RecruiterProjectsPage() {
  const projects = await getProjects();

  return (
    <SubPageLayout title="Projekter" backHref="/recruiter" backLabel="Rekrutterer">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {projects.map((project, i) => (
          <ProjectCard key={project._id} project={project} index={i} />
        ))}
      </div>
    </SubPageLayout>
  );
}
