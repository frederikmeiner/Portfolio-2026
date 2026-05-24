import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const si = (name) => `https://cdn.simpleicons.org/${name}`;

// Flyt WordPress og Sanity til CMS, tilføj Strapi
await client.mutate([
  { patch: { id: "skill-wordpress", set: { category: "CMS" } } },
  { patch: { id: "skill-sanity",    set: { category: "CMS" } } },
  {
    createOrReplace: {
      _type: "skill",
      _id: "skill-strapi",
      name: "Strapi",
      category: "CMS",
      icon: si("strapi"),
      order: 100,
    },
  },
]);

console.log("✓ WordPress → CMS");
console.log("✓ Sanity → CMS");
console.log("✓ Strapi oprettet i CMS");
