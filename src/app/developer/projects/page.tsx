import SubPageLayout from "@/components/netflix/SubPageLayout";
import ProjectBentoCard from "@/components/cards/ProjectBentoCard";
import { getProjects } from "@/lib/sanity/queries";

export default async function DeveloperProjectsPage() {
  const projects = await getProjects();

  // Featured projekter vises som store bento-celler (2×2)
  const sorted = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ];

  return (
    <SubPageLayout title="Projekter" backHref="/developer" backLabel="Udvikler">
      <div className="flex items-center gap-4 mb-8">
        <span
          className="text-sm px-3 py-1 rounded-full"
          style={{
            background: "var(--surface-2)",
            color: "var(--muted)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-body)",
          }}
        >
          {projects.length} projekter
        </span>
      </div>

      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        style={{ gridAutoRows: "200px", gridAutoFlow: "dense" }}
      >
        {sorted.map((project, i) => (
          <ProjectBentoCard
            key={project._id}
            project={project}
            variant={project.featured ? "large" : "standard"}
            index={i}
          />
        ))}
      </div>
    </SubPageLayout>
  );
}
