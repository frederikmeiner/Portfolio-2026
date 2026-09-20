/**
 * Sætter teknologi-tags på alle projekter ud fra hvad sitene faktisk er bygget
 * med (tjekket mod de live sites 20. sep. 2026), og opretter de kompetencer
 * der manglede. Idempotent — kan køres igen.
 *
 *   node --env-file=.env --env-file=.env.local scripts/set-project-tags.mjs
 *
 * Rækkefølgen betyder noget: kort og delekort viser de første 3-4 tags, så det
 * der adskiller et projekt står først, og WordPress/PHP/MySQL sidst.
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const NEW_SKILLS = [
  { _id: "skill-breakdance", _type: "skill", name: "Breakdance", category: "Frontend", order: 6 },
  { _id: "skill-multisite", _type: "skill", name: "Multisite", category: "CMS", order: 8, icon: "https://cdn.simpleicons.org/wordpress" },
];

const WP = ["wordpress", "php", "mysql"];

/** slug → skill-id'er uden "skill-"-præfiks. */
const TAGS = {
  caolin: ["breakdance", ...WP, "cloudways"],
  icars: ["elementor", ...WP],
  kompositterrasse: ["woocommerce", "elementor", ...WP],
  // Headless: Next.js foran, WordPress som CMS bagved.
  "brdr-gamsgaard": ["nextjs", "react", "typescript", "tailwind", ...WP],
  "brand-by-hand": ["breakdance", "woocommerce", "gsap", ...WP],
  vinoble: ["woocommerce", "elementor", "gsap", ...WP],
  "danida-fellowship-centre": ["breakdance", "gsap", ...WP],
  genan: ["elementor", "multisite", ...WP],
  "hotel-de-ville": ["elementor", "multisite", ...WP],
  "roende-hoejskole": ["elementor", ...WP],
  agenz: [...WP],
  kjaerdesign: [...WP],
  "savoy-hotel": ["gsap", ...WP, "plesk"],
  "gourmet-catering": ["elementor", "gsap", ...WP],
  "wp-nordic": ["woocommerce", "elementor", "gsap", "multisite", ...WP, "plesk"],
  surfcafe: ["woocommerce", "elementor", ...WP],
  silikatteknik: ["woocommerce", "elementor", ...WP],
  "nordic-glass": ["elementor", "gsap", "multisite", ...WP, "plesk"],
  surfagency: ["elementor", "multisite", ...WP],
  "stenhoej-hydraulik": ["woocommerce", "elementor", "multisite", ...WP],
  // Specialbygget — ikke WordPress.
  politisport: ["php"],
  oelmanden: ["woocommerce", ...WP],
  turnpikes: [...WP],
  "mollerup-golf-club": ["woocommerce", "elementor", ...WP],
  ownersclub: ["woocommerce", "elementor", ...WP],
  geovent: ["elementor", ...WP],
  "sculpture-by": ["elementor", "multisite", ...WP],
};

for (const skill of NEW_SKILLS) await client.createIfNotExists(skill);

const projects = await client.fetch(`*[_type == "project"]{ _id, "slug": slug.current, title }`);
const skillIds = new Set(await client.fetch(`*[_type == "skill"]._id`));
const tx = client.transaction();
const missing = [];

for (const project of projects) {
  const tags = TAGS[project.slug];
  if (!tags) { missing.push(project.slug); continue; }
  const unknown = tags.filter((t) => !skillIds.has(`skill-${t}`));
  if (unknown.length) throw new Error(`${project.slug}: ukendte skills ${unknown.join(", ")}`);
  tx.patch(project._id, (p) =>
    p.set({ technologies: tags.map((t) => ({ _key: `tech-${t}`, _type: "reference", _ref: `skill-${t}` })) })
  );
}

await tx.commit();
console.log(`Tags sat på ${projects.length - missing.length} projekter.`);
if (missing.length) console.log("Uændret (ikke i listen):", missing.join(", "));
