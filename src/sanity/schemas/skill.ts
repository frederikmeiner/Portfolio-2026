import { defineField, defineType } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Navn", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: ["Frontend", "Backend", "CMS", "Database", "DevOps", "Design", "Andet"],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "icon", title: "Ikon (SVG/URL)", type: "url" }),
    defineField({
      name: "level",
      title: "Niveau",
      type: "string",
      options: { list: ["Begynder", "Øvet", "Avanceret", "Ekspert"] },
    }),
    defineField({ name: "order", title: "Sorteringsrækkefølge", type: "number" }),
  ],
  orderings: [{ title: "Kategori", name: "categoryAsc", by: [{ field: "category", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "category" } },
});
