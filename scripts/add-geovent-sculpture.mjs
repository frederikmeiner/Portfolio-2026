/**
 * Opretter projekterne Geovent og Sculpture by. Billederne er skærmbilleder af
 * forsiderne; mappen med dem gives som argument. Idempotent på dokument-id.
 *
 *   node --env-file=.env --env-file=.env.local scripts/add-geovent-sculpture.mjs <mappe-med-jpg>
 *
 * Tags sættes af set-project-tags.mjs bagefter.
 */
import { createReadStream } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const dir = process.argv[2];
if (!dir) throw new Error("Angiv mappen med geovent.jpg og sculptureby.jpg");

const PROJECTS = [
  {
    _id: "project-sculpture-by",
    file: "sculptureby.jpg",
    title: "Sculpture by",
    slug: "sculpture-by",
    // Lige efter Hotel de Ville (0|0012kw:) og før Rønde Højskole (0|001aao:).
    orderRank: "0|0016a0:",
    publishedAt: "2025-09-01",
    liveUrl: "https://sculptureby.dk/",
    videoUrl: "https://sculptureby.dk/wp-content/uploads/2025/08/Sculpture_topvideo.mp4",
    description:
      "Website for Sculpture by — en eksklusiv plastikkirurgisk klinik ved Kurhotel Skodsborg. Et roligt, redaktionelt udtryk med video i fuld bredde, bygget i WordPress og Elementor på en multisite med dansk og engelsk version.",
  },
  {
    _id: "project-geovent",
    file: "geovent.jpg",
    title: "Geovent",
    slug: "geovent",
    // Midt i feltet, efter Rønde Højskole (0|001aao:) og før AGENZ (0|001i0g:) — ikke øverst.
    orderRank: "0|001e00:",
    publishedAt: "2024-01-01",
    liveUrl: "https://geovent.co.uk/",
    description:
      "International WordPress-platform for GEOVENT, der leverer udsugning og ventilation til industri og værksteder. Samme løsning kører på 13 landedomæner med hver sit sprog, med et stort produktkatalog og søgning på tværs af det hele.",
  },
];

for (const { file, slug, _id, ...fields } of PROJECTS) {
  const existing = await client.getDocument(_id);
  let image = existing?.image;
  if (!image) {
    const asset = await client.assets.upload("image", createReadStream(join(dir, file)), { filename: file });
    image = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  }
  await client.createOrReplace({
    _id,
    _type: "project",
    ...fields,
    slug: { _type: "slug", current: slug },
    image,
    featured: false,
    size: "normal",
    technologies: existing?.technologies ?? [],
  });
  console.log("ok:", fields.title);
}
