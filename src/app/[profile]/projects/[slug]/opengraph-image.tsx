import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProject } from "@/lib/sanity/queries";

export const alt = "Projekt af Frederik Meiner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

/**
 * Delekort i Netflix-stil: projektets billede som baggrund, titel, teknologier
 * og afsender. Før blev projektbilledet delt råt — uden titel og uden navn.
 */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, bold, medium] = await Promise.all([
    getProject(slug),
    font("archivo-latin-700-normal.woff"),
    font("archivo-latin-500-normal.woff"),
  ]);

  const title = project?.title ?? "Frederik Meiner";
  const tech = (project?.technologies ?? []).slice(0, 4).map((t) => t.name);
  const year = project?.publishedAt ? new Date(project.publishedAt).getFullYear() : null;
  // Sanity beskærer og konverterer selv — ImageResponse kan ikke læse webp/avif.
  const raw = project?.image?.asset?.url;
  const background = raw ? `${raw}?w=1200&h=630&fit=crop&fm=jpg&q=80` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #141414 0%, #1e3a8a 100%)",
          fontFamily: "Archivo",
        }}
      >
        {background && (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renderer ikke next/image
          <img src={background} alt="" width={1200} height={630} style={{ position: "absolute", objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background: "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", width: 6, height: 34, background: "#e50914" }} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 6, color: "#fafafa" }}>
              FREDERIK MEINER
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 500, letterSpacing: 4, color: "rgba(250,250,250,0.7)" }}>
              {year ? `PROJEKT · ${year}` : "PROJEKT"}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 12,
                fontSize: title.length > 28 ? 72 : 96,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: -2,
                color: "#fafafa",
              }}
            >
              {title}
            </div>
            {tech.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                {tech.map((name) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      padding: "8px 20px",
                      borderRadius: 999,
                      fontSize: 24,
                      fontWeight: 500,
                      color: "#fafafa",
                      background: "rgba(255,255,255,0.14)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: bold, weight: 700, style: "normal" },
        { name: "Archivo", data: medium, weight: 500, style: "normal" },
      ],
    }
  );
}
