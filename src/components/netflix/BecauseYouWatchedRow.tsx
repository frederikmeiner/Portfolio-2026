"use client";

import ContentRow from "@/components/netflix/ContentRow";
import ProjectCard from "@/components/cards/ProjectCard";
import { relatedProjects } from "@/lib/related-projects";
import { useWatchHistory } from "@/lib/use-watch-history";
import { PROFILES, type ProfileId } from "@/lib/profiles";
import type { Project } from "@/lib/sanity/queries";

/** Under to forslag er det ikke en række, bare et kort der ligger og flyder. */
const MIN_CARDS = 2;

/**
 * "Fordi du så …": forslag ud fra det projekt, den besøgende senest har åbnet.
 * Sætter historikken (Continue Watching) sammen med ligheden fra "Mere som
 * dette" — og springer projekter over, man allerede har set.
 */
export default function BecauseYouWatchedRow({ profile, projects }: { profile: ProfileId; projects: Project[] }) {
  const history = useWatchHistory(profile);
  const base = `${PROFILES[profile].href}/projects`;

  const bySlug = new Map(projects.map((p) => [p.slug.current, p]));
  const seen = history.flatMap((entry) =>
    entry.href.startsWith(`${base}/`) ? bySlug.get(entry.href.slice(base.length + 1)) ?? [] : []
  );

  // Historikken har nyeste forrest. Har det seneste projekt ingen slægtninge, prøves det næste.
  for (const source of seen) {
    const picks = relatedProjects(source, projects, 12).filter((p) => !seen.includes(p)).slice(0, 8);
    if (picks.length < MIN_CARDS) continue;

    return (
      <div className="mt-10">
        <h2
          className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Fordi du så {source.title}
        </h2>
        <ContentRow title="">
          {picks.map((project) => (
            <ProjectCard key={project._id} project={project} href={`${base}/${project.slug.current}`} />
          ))}
        </ContentRow>
      </div>
    );
  }

  return null;
}
