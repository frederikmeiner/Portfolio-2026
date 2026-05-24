import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const experiences = [
  {
    _id: "experience-senior-frontend-2025",
    company: "Brand by Hand",
    role: "Senior Frontend Developer",
    startDate: "2025-01-01",
    current: true,
  },
  {
    _id: "experience-professionsbachelor-2022",
    company: "Erhvervsakademi Aarhus",
    role: "Professionsbachelor i webudvikling",
    startDate: "2022-08-01",
    endDate: "2024-06-30",
    current: false,
  },
  {
    _id: "experience-frontend-developer-2021",
    company: "Brand by Hand",
    role: "Frontend Developer",
    startDate: "2021-01-01",
    endDate: "2025-01-01",
    current: false,
  },
  {
    _id: "experience-multimediedesigner-2020",
    company: "Erhvervsakademi Aarhus",
    role: "Multimediedesigner",
    startDate: "2020-08-01",
    endDate: "2022-06-30",
    current: false,
  },
];

await client.mutate(
  experiences.map((e) => ({
    createOrReplace: {
      _type: "experience",
      _id: e._id,
      company: e.company,
      role: e.role,
      startDate: e.startDate,
      ...(e.endDate ? { endDate: e.endDate } : {}),
      current: e.current,
    },
  }))
);

console.log(`✓ ${experiences.length} erfaringer oprettet`);
experiences.forEach((e) => console.log(`  - ${e.role} @ ${e.company} (${e.startDate.slice(0, 4)})`));
