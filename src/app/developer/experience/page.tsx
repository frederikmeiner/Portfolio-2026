import SubPageLayout from "@/components/netflix/SubPageLayout";
import { getExperiences } from "@/lib/sanity/queries";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("da-DK", { month: "short", year: "numeric" });
}

export default async function DeveloperExperiencePage() {
  const experiences = await getExperiences();

  return (
    <SubPageLayout title="Erfaring" backHref="/developer" backLabel="Udvikler">
      <div className="flex flex-col gap-6 max-w-3xl">
        {experiences.map((exp, i) => (
          <div
            key={exp._id}
            className="relative flex gap-6"
          >
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: exp.current ? "#2563eb" : "var(--border)" }}
              />
              {i < experiences.length - 1 && (
                <div className="w-px flex-1 mt-2" style={{ background: "var(--border)" }} />
              )}
            </div>

            {/* Content */}
            <div
              className="flex-1 rounded-xl p-5 mb-6"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <div>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    className="text-sm font-medium mt-0.5"
                    style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
                  >
                    {exp.company}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {exp.current && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#2563eb22", color: "#2563eb", fontFamily: "var(--font-body)" }}
                    >
                      Nuværende
                    </span>
                  )}
                  <span
                    className="text-xs"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
                  >
                    {formatDate(exp.startDate)} — {exp.current ? "Nu" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                </div>
              </div>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.technologies.map((t) => (
                    <span
                      key={t._id}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--surface)", color: "var(--muted)", fontFamily: "var(--font-body)" }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SubPageLayout>
  );
}
