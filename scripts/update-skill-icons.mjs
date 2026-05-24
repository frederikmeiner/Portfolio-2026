import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const si  = (name) => `https://cdn.simpleicons.org/${name}`;
const ski = (name) => `https://skillicons.dev/icons?i=${name}`;

const iconUpdates = [
  // Frontend
  { _id: "skill-react",       icon: ski("react") },
  { _id: "skill-nextjs",      icon: ski("nextjs") },
  { _id: "skill-typescript",  icon: ski("ts") },
  { _id: "skill-tailwind",    icon: ski("tailwind") },
  { _id: "skill-gsap",        icon: si("greensock") },
  { _id: "skill-elementor",   icon: si("elementor") },
  { _id: "skill-scss",        icon: ski("sass") },
  // Backend
  { _id: "skill-wordpress",   icon: ski("wordpress") },
  { _id: "skill-woocommerce", icon: si("woocommerce") },
  { _id: "skill-php",         icon: ski("php") },
  { _id: "skill-sanity",      icon: si("sanity") },
  // Database
  { _id: "skill-mysql",       icon: ski("mysql") },
  { _id: "skill-mongodb",     icon: ski("mongodb") },
  // DevOps
  { _id: "skill-dns",         icon: ski("cloudflare") },
  { _id: "skill-cloudways",   icon: si("cloudways") },
  { _id: "skill-cicd",        icon: ski("githubactions") },
];

console.log("Opdaterer ikoner...");
await client.mutate(
  iconUpdates.map(({ _id, icon }) => ({
    patch: { id: _id, set: { icon } },
  }))
);
console.log(`✓ ${iconUpdates.length} ikoner opdateret`);

console.log("Sletter cPanel...");
await client.mutate([{ delete: { id: "skill-cpanel" } }]);
console.log("✓ cPanel slettet");

console.log("Opretter Plesk...");
await client.mutate([{
  createOrReplace: {
    _type: "skill",
    _id: "skill-plesk",
    name: "Plesk",
    category: "DevOps",
    icon: si("plesk"),
    order: 99,
  },
}]);
console.log("✓ Plesk oprettet");

console.log("Færdig!");
