import { defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Erfaring",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      description:
        "Job og uddannelse vises i hver sin gruppe. Blandes de sammen, ligner overlappende studier et hul i karrieren.",
      options: {
        list: [
          { title: "Erhvervserfaring", value: "work" },
          { title: "Uddannelse", value: "education" },
        ],
        layout: "radio",
      },
      initialValue: "work",
      validation: (r) => r.required(),
    }),
    defineField({ name: "company", title: "Virksomhed", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Titel/Rolle", type: "string", validation: (r) => r.required() }),
    defineField({ name: "startDate", title: "Startdato", type: "date", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "Slutdato", type: "date" }),
    defineField({ name: "current", title: "Nuværende job", type: "boolean", initialValue: false }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      rows: 3,
      description: "Et par linjer om rollen — ansvar og omfang, ikke en opgaveliste.",
    }),
    defineField({
      name: "highlights",
      title: "Nøglepunkter",
      type: "array",
      of: [{ type: "string" }],
      description: "Konkrete resultater og ansvarsområder. Vises som punktliste under beskrivelsen.",
    }),
    defineField({ name: "logo", title: "Virksomhedslogo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "technologies",
      title: "Teknologier brugt",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
    }),
  ],
  orderings: [{ title: "Nyeste først", name: "dateDesc", by: [{ field: "startDate", direction: "desc" }] }],
  preview: {
    select: { title: "role", subtitle: "company", media: "logo" },
  },
});
