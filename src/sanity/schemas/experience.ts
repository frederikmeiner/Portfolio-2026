import { defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Erfaring",
  type: "document",
  fields: [
    defineField({ name: "company", title: "Virksomhed", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Titel/Rolle", type: "string", validation: (r) => r.required() }),
    defineField({ name: "startDate", title: "Startdato", type: "date", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "Slutdato", type: "date" }),
    defineField({ name: "current", title: "Nuværende job", type: "boolean", initialValue: false }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "array",
      of: [{ type: "block" }],
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
