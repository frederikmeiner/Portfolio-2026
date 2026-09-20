import Image from "next/image";
import type { Project } from "@/lib/sanity/queries";

/** Toppen af en titel-side: projektets billede eller klip, med fade ned i siden. */
export default function TitleHero({ project }: { project: Project }) {
  const image = project.image?.asset?.url;

  return (
    <section className="relative overflow-hidden" style={{ height: "60vh", minHeight: 360 }}>
      {project.videoUrl ? (
        <video
          src={project.videoUrl}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : image ? (
        <Image src={image} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)" }} />
      )}
      {/* Sløring under titlen, tonet ud opad. Mørkere alene er ikke nok, når billedet
          er et skærmbillede: sitets egen overskrift står stadig og støjer bag titlen. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "62%",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          maskImage: "linear-gradient(to top, black 45%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 45%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        // Bunden er næsten dækkende et godt stykke op: mange billeder er skærmbilleder
        // af sitet, og sitets egen overskrift lå ellers og skinnede igennem bag titlen.
        style={{
          background:
            "linear-gradient(to top, var(--background) 0%, color-mix(in srgb, var(--background) 88%, transparent) 24%, rgba(0,0,0,0.3) 58%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 px-5 md:px-16 pb-6">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)" }}
        >
          {project.title}
        </h1>
      </div>
    </section>
  );
}
