import SubPageLayout from "@/components/netflix/SubPageLayout";
import { getExperiences, type Experience } from "@/lib/sanity/queries";
import { PROFILES, type ProfileId } from "@/lib/profiles";
import { yearsOfExperience } from "@/lib/career";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("da-DK", { month: "short", year: "numeric" });
}

function TimelineItem({ item, last }: { item: Experience; last: boolean }) {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
          style={{ background: item.current ? "#2563eb" : "var(--border)" }}
        />
        {!last && <div className="w-px flex-1 mt-2" style={{ background: "var(--border)" }} />}
      </div>

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
              {item.role}
            </p>
            <p
              className="text-sm font-medium mt-0.5"
              style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            >
              {item.company}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {item.current && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "#2563eb22", color: "#2563eb", fontFamily: "var(--font-body)" }}
              >
                Nuværende
              </span>
            )}
            <span
              className="text-xs whitespace-nowrap"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              {formatDate(item.startDate)} — {item.current ? "Nu" : item.endDate ? formatDate(item.endDate) : ""}
            </span>
          </div>
        </div>

        {item.description && (
          <p
            className="text-sm leading-relaxed mt-3"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            {item.description}
          </p>
        )}

        {item.highlights && item.highlights.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1.5">
            {item.highlights.map((h) => (
              <li
                key={h}
                className="text-sm leading-relaxed pl-4 relative"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
              >
                <span className="absolute left-0" style={{ color: "var(--accent)" }}>
                  ·
                </span>
                {h}
              </li>
            ))}
          </ul>
        )}

        {item.technologies && item.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.technologies.map((t) => (
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
  );
}

export default async function ExperiencePage({ profile }: { profile: ProfileId }) {
  const experiences = await getExperiences();
  const { href, label } = PROFILES[profile];

  // Uddannelse lå før i samme tidslinje som jobbene. Da studierne løb sideløbende
  // med arbejdet, læste en hurtig læser slutdatoen på bacheloren som "nyuddannet"
  // og overså de år der lå bagved. De to grupper holdes derfor adskilt.
  const work = experiences.filter((e) => e.kind !== "education");
  const education = experiences.filter((e) => e.kind === "education");
  const years = yearsOfExperience();

  return (
    <SubPageLayout title="Erfaring" backHref={href} backLabel={label} maxWidth="1320px">
      <div className="max-w-3xl">
        {years > 0 && (
          <p
            className="text-base mb-10 leading-relaxed"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            Jeg startede som studiejob hos Brand by Hand i 2021 og er{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
              senior i dag
            </span>{" "}
            — {years}+ år, samme bureau hele vejen. Nu sidder jeg på de største kunder og
            lærer praktikanter op.
          </p>
        )}

        <h2
          className="text-sm font-semibold uppercase tracking-widest mb-6"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          Erhvervserfaring
        </h2>
        <div className="flex flex-col gap-6">
          {work.map((item, i) => (
            <TimelineItem key={item._id} item={item} last={i === work.length - 1} />
          ))}
        </div>

        {education.length > 0 && (
          <>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mt-14 mb-6"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              Uddannelse
            </h2>
            <div className="flex flex-col gap-6">
              {education.map((item, i) => (
                <TimelineItem key={item._id} item={item} last={i === education.length - 1} />
              ))}
            </div>
          </>
        )}
      </div>
    </SubPageLayout>
  );
}
