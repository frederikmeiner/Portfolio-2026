/**
 * Engangsopdatering af projekterne, 20. sep. 2026. Idempotent.
 *
 *   node --env-file=.env --env-file=.env.local scripts/update-projects-2026-09.mjs <mappe>
 *
 * <mappe> indeholder skærmbillederne (<slug>.jpg, 2400×1500) og ep-icon.png.
 *
 *  1. Kompetencerne ElasticPress og Supabase.
 *  2. Nye billeder til de projekter, hvis billede var for lille til en hero.
 *  3. Datoer. De fleste stod til pladsholderen 2024-01-01. De nye er skøn ud fra
 *     sitene selv: hvornår den ældste side blev oprettet (når det ikke er
 *     bureau-skabelonens), og hvilke måneder forsidens filer er uploadet i.
 *  4. Portfolioet selv som projekt.
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
if (!dir) throw new Error("Angiv mappen med skærmbillederne");

const upload = async (file) => (await client.assets.upload("image", createReadStream(join(dir, file)), { filename: file }));
const imageOf = (asset) => ({ _type: "image", asset: { _type: "reference", _ref: asset._id } });

// 1. Kompetencer
if (!(await client.getDocument("skill-elasticpress"))) {
  const icon = await upload("ep-icon.png");
  await client.create({ _id: "skill-elasticpress", _type: "skill", name: "ElasticPress", category: "Backend", order: 10, icon: icon.url });
}
await client.createIfNotExists({ _id: "skill-supabase", _type: "skill", name: "Supabase", category: "Database", order: 13, icon: "https://cdn.simpleicons.org/supabase" });

// 2. Billeder — kun dem der var under ca. 1000 px brede.
const NEW_IMAGES = ["genan", "kjaerdesign", "vinoble", "kompositterrasse", "hotel-de-ville", "wp-nordic"];
for (const slug of NEW_IMAGES) {
  const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]{ _id, "w": image.asset->metadata.dimensions.width }`, { slug });
  if (!doc) throw new Error(`Ukendt projekt: ${slug}`);
  if (doc.w >= 2000) { console.log("billede allerede nyt:", slug); continue; }
  await client.patch(doc._id).set({ image: imageOf(await upload(`${slug}.jpg`)) }).commit();
  console.log("nyt billede:", slug);
}

// 3. Datoer. Caolín, ICARS, DFC og Sculpture by havde allerede rigtige datoer og røres ikke.
const DATES = {
  kompositterrasse: "2026-01-01", // alle sider genoprettet jan. 2026 — genopbygning
  "brdr-gamsgaard": "2025-02-01",
  "brand-by-hand": "2024-04-01",
  vinoble: "2024-10-01",
  genan: "2025-06-01",
  "hotel-de-ville": "2025-01-01",
  "roende-hoejskole": "2024-12-01",
  geovent: "2023-04-01", // sitet er fra 2020; forsidens nuværende indhold er fra forår 2023
  kjaerdesign: "2022-01-01",
  "savoy-hotel": "2024-02-01",
  "gourmet-catering": "2024-09-01",
  "wp-nordic": "2024-09-01",
  surfcafe: "2021-07-01",
  silikatteknik: "2022-08-01",
  "nordic-glass": "2024-11-01",
  surfagency: "2021-07-01",
  "stenhoej-hydraulik": "2025-03-01",
  oelmanden: "2022-11-01",
  turnpikes: "2024-09-01",
  "mollerup-golf-club": "2020-11-01",
  ownersclub: "2024-03-01",
};
const tx = client.transaction();
for (const [slug, publishedAt] of Object.entries(DATES)) {
  const id = await client.fetch(`*[_type == "project" && slug.current == $slug][0]._id`, { slug });
  if (!id) throw new Error(`Ukendt projekt: ${slug}`);
  tx.patch(id, (p) => p.set({ publishedAt }));
}
await tx.commit();
console.log("datoer sat:", Object.keys(DATES).length);

// 4. Portfolioet selv
const existing = await client.getDocument("project-portfolio-2026");
await client.createOrReplace({
  _id: "project-portfolio-2026",
  _type: "project",
  title: "Portfolio 2026",
  slug: { _type: "slug", current: "portfolio-2026" },
  // Først blandt de ikke-fremhævede: efter Genan (0|0007ps:), før Hotel de Ville (0|0012kw:).
  orderRank: "0|000zzz:",
  description:
    "Sitet du kigger på. Et portfolio bygget som en streamingtjeneste: tre profiler med hver sin forside, projekter og indhold fra Sanity, og en ønskeliste hvor reservationer er skjult for ejeren i selve databasen. Next.js og TypeScript foran, Supabase bagved — og lint, tests og en browser-test foran hvert deploy.",
  image: existing?.image ?? imageOf(await upload("portfolio.jpg")),
  videoUrl: "https://frederikmeiner.com/hero-developer.mp4",
  liveUrl: "https://frederikmeiner.com/",
  githubUrl: "https://github.com/frederikmeiner/Portfolio-2026",
  featured: false,
  size: "normal",
  publishedAt: "2026-05-23",
  technologies: existing?.technologies ?? [],
});
console.log("ok: Portfolio 2026");
