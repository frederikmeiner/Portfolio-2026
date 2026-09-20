import Image from "next/image";
import { Check } from "lucide-react";
import type { Project } from "@/lib/sanity/queries";

const kicker = "mb-2 text-xs font-semibold uppercase tracking-widest";
const heading = "mb-4 text-2xl font-bold leading-snug md:text-3xl";
const body = "text-base leading-relaxed";

function Prose({ text }: { text: string }) {
  // Afsnit skilles med en tom linje i Studio.
  return (
    <div className="flex flex-col gap-4">
      {text.split(/\n\s*\n/).map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className={body}
          style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", opacity: 0.88 }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className={kicker} style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
        {label}
      </p>
      <h2 className={heading} style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

type GalleryItem = NonNullable<Project["gallery"]>[number];

function GalleryImage({ image, sizes, priority = false }: { image: GalleryItem; sizes: string; priority?: boolean }) {
  return (
    <figure>
      <div
        className="overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
      >
        <Image
          src={image.url}
          alt={image.caption ?? ""}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full"
        />
      </div>
      {image.caption && (
        <figcaption className="mt-3 text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Case-delen af en projektside. Viser kun de afsnit, der er udfyldt i Sanity — ingen felter, intet output. */
export default function ProjectCase({ project }: { project: Project }) {
  const { role, challenge, solution, result } = project;
  const highlights = project.highlights ?? [];
  const facts = project.facts ?? [];
  const gallery = project.gallery ?? [];

  if (!role && !challenge && !solution && !result && !highlights.length && !facts.length && !gallery.length) {
    return null;
  }

  const [lead, ...rest] = gallery;
  const label = "mb-1 text-xs uppercase tracking-widest";

  return (
    <div className="mb-16 flex flex-col gap-14">
      {(role || facts.length > 0) && (
        <dl
          className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-2xl p-6 md:grid-cols-4"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          {role && (
            <div className="col-span-2">
              <dt className={label} style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                Min rolle
              </dt>
              <dd
                className="text-sm font-semibold leading-snug"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
              >
                {role}
              </dd>
            </div>
          )}
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className={label} style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                {fact.label}
              </dt>
              <dd
                className="text-lg font-bold leading-tight"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-heading)" }}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {lead && <GalleryImage image={lead} sizes="(max-width: 1100px) 100vw, 1100px" />}

      {(challenge || solution) && (
        <div className="grid gap-12 md:grid-cols-2">
          {challenge && (
            <Section label="Opgaven" title="Udfordringen">
              <Prose text={challenge} />
            </Section>
          )}
          {solution && (
            <Section label="Sådan blev det løst" title="Løsningen">
              <Prose text={solution} />
            </Section>
          )}
        </div>
      )}

      {highlights.length > 0 && (
        <Section label="I praksis" title="Løsningen i punkter">
          <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <Check size={18} className="mt-1 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span
                  className={body}
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", opacity: 0.88 }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {rest.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((image) => (
            <GalleryImage key={image.url} image={image} sizes="(max-width: 768px) 100vw, 550px" />
          ))}
        </div>
      )}

      {result && (
        <Section label="Efter lancering" title="Resultatet">
          <Prose text={result} />
        </Section>
      )}
    </div>
  );
}
