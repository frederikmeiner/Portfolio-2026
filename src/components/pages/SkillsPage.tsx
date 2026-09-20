import SubPageLayout from "@/components/netflix/SubPageLayout";
import SkillCard from "@/components/cards/SkillCard";
import { getProjects, getSkills } from "@/lib/sanity/queries";
import { countTechnologies, techSlug } from "@/lib/tech-slug";
import { PROFILES, type ProfileId } from "@/lib/profiles";

const categoryOrder = ["Frontend", "Backend", "CMS", "Database", "DevOps", "Design", "Andet"];

export default async function SkillsPage({ profile }: { profile: ProfileId }) {
  const [skills, projects] = await Promise.all([getSkills(), getProjects()]);
  const { href, label } = PROFILES[profile];
  // "Jeg kan X" bliver til "her har jeg brugt X": hvert kort linker til sine projekter.
  const used = new Map(countTechnologies(projects).map((t) => [t.slug, t.count]));

  const grouped = categoryOrder.reduce<Record<string, typeof skills>>((acc, cat) => {
    const items = skills.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <SubPageLayout title="Kompetencer" backHref={href} backLabel={label}>
      <div className="flex flex-col gap-12">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              {category}
            </h2>
            <div className="flex flex-wrap gap-4">
              {items.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  projectCount={used.get(techSlug(skill.name)) ?? 0}
                  projectsHref={`${href}/projects?tech=${techSlug(skill.name)}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SubPageLayout>
  );
}
