import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const newSkills = [
  { _id: "skill-scss",      name: "SCSS",      category: "Frontend", order: 7  },
  { _id: "skill-dns",       name: "DNS",        category: "DevOps",   order: 13 },
  { _id: "skill-cloudways", name: "Cloudways",  category: "DevOps",   order: 14 },
  { _id: "skill-cpanel",    name: "cPanel",     category: "DevOps",   order: 15 },
];

await client.mutate(
  newSkills.map((s) => ({
    createOrReplace: {
      _type: "skill",
      _id: s._id,
      name: s.name,
      category: s.category,
      order: s.order,
    },
  }))
);

console.log(`✓ ${newSkills.length} skills tilføjet: ${newSkills.map(s => s.name).join(", ")}`);
