import Image from "next/image";
import type { Project } from "@/lib/sanity/queries";

/** Toppen af en titel-side: projektets billede eller klip, med fade ned i siden. */
export default function TitleHero({ project }: { project: Project }) {
  const image = project.image?.asset.url;

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
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, var(--background) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.35) 100%)" }}
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
