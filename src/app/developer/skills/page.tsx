import SubPageLayout from "@/components/netflix/SubPageLayout";
import SkillCard from "@/components/cards/SkillCard";
import { getSkills } from "@/lib/sanity/queries";

const categoryOrder = ["Frontend", "Backend", "CMS", "Database", "DevOps", "Design", "Andet"];

export default async function DeveloperSkillsPage() {
  const skills = await getSkills();

  const grouped = categoryOrder.reduce<Record<string, typeof skills>>((acc, cat) => {
    const items = skills.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <SubPageLayout title="Skills" backHref="/developer" backLabel="Udvikler">
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
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SubPageLayout>
  );
}
