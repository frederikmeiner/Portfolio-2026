import Link from "next/link";
import { Code, ExternalLink, Star } from "lucide-react";
import SubPageLayout from "@/components/netflix/SubPageLayout";
import TitleHero from "@/components/netflix/TitleHero";
import ContentRow from "@/components/netflix/ContentRow";
import ProjectCard from "@/components/cards/ProjectCard";
import { relatedProjects } from "@/lib/related-projects";
import { PROFILES, type ProfileId } from "@/lib/profiles";
import type { Project } from "@/lib/sanity/queries";

type Props = { profile: ProfileId; project: Project; all: Project[] };

const button =
  "flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-opacity duration-200 hover:opacity-85";

/** Netflix' titelside for ét projekt: hero, meta-linje, knapper, tags og "Mere som dette". */
export default function ProjectTitlePage({ profile, project, all }: Props) {
  const base = `${PROFILES[profile].href}/projects`;
  const year = project.publishedAt ? new Date(project.publishedAt).getFullYear() : null;
  const tech = project.technologies ?? [];
  const related = relatedProjects(project, all);

  return (
    <SubPageLayout
      title=""
      backHref={base}
      backLabel="Projekter"
      hero={<TitleHero project={project} />}
      maxWidth="1100px"
    >
      {/* Meta-linje — som Netflix' "2024 · 3 sæsoner · HD" */}
      <ul
        className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-sm"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {year && <li>{year}</li>}
        <li>
          {tech.length} {tech.length === 1 ? "teknologi" : "teknologier"}
        </li>
        {project.featured && (
          <li className="flex items-center gap-1" style={{ color: "var(--accent)" }}>
            <Star size={13} fill="currentColor" /> Fremhævet
          </li>
        )}
      </ul>

      <div className="flex flex-wrap gap-3 mb-8">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={button}
            style={{ background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-body)" }}
          >
            <ExternalLink size={16} /> Åbn
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={button}
            style={{
              background: "var(--surface-2)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Code size={16} /> Kode
          </a>
        )}
      </div>

      {project.description && (
        <p
          className="max-w-2xl text-base md:text-lg leading-relaxed mb-8"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
        >
          {project.description}
        </p>
      )}

      {tech.length > 0 && (
        <div className="mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            Teknologier
          </p>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <Link
                key={t._id}
                href={`${PROFILES[profile].href}/skills`}
                className="rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        // ContentRow har sin egen side-padding; træk den ud til kanten af indholdet.
        <div className="-mx-5 md:-mx-16">
          <ContentRow title="Mere som dette">
            {related.map((p) => (
              <ProjectCard key={p._id} project={p} href={`${base}/${p.slug.current}`} />
            ))}
          </ContentRow>
        </div>
      )}
    </SubPageLayout>
  );
}
