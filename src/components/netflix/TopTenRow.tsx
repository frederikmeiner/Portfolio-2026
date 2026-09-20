import ContentRow from "@/components/netflix/ContentRow";
import ProjectCard from "@/components/cards/ProjectCard";
import { getProjects } from "@/lib/sanity/queries";
import { getTopProjects } from "@/lib/project-views";
import { PROFILES, type ProfileId } from "@/lib/profiles";

/** Netflix' Top 10 med de store tal — rangeret efter hvor meget projekterne faktisk bliver set. */
export default async function TopTenRow({ profile }: { profile: ProfileId }) {
  const { projects, ranked } = await getTopProjects(await getProjects());
  if (projects.length === 0) return null;

  const base = `${PROFILES[profile].href}/projects`;

  return (
    <div className="mt-10">
      <h2
        className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {/* Overskriften lover kun en rangliste, når der er tal bag den. */}
        {ranked ? "Top 10 projekter lige nu" : "Top 10 — udvalgt af Frederik"}
      </h2>
      <ContentRow title="">
        {projects.map((project, i) => (
          <ProjectCard key={project._id} project={project} href={`${base}/${project.slug.current}`} rank={i + 1} />
        ))}
      </ContentRow>
    </div>
  );
}
