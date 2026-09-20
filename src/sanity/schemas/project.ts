import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const project = defineType({
  name: "project",
  title: "Projekt",
  type: "document",
  fields: [
    orderRankField({ type: "project" }),
    defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Beskrivelse", type: "text", rows: 4 }),
    defineField({ name: "image", title: "Billede", type: "image", options: { hotspot: true } }),
    defineField({
      name: "technologies",
      title: "Teknologier",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
    }),
    defineField({ name: "videoUrl", title: "Video URL (mp4/webm)", type: "url" }),
    defineField({ name: "liveUrl", title: "Live URL", type: "url" }),
    defineField({ name: "githubUrl", title: "GitHub URL", type: "url" }),
    defineField({ name: "featured", title: "Fremhævet", type: "boolean", initialValue: false }),
    defineField({
      name: "size",
      title: "Størrelse i grid",
      type: "string",
      options: {
        list: [
          { title: "Normal (1×1)", value: "normal" },
          { title: "Stor (2×2)", value: "large" },
          { title: "Høj (1×2)", value: "tall" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
    defineField({ name: "publishedAt", title: "Dato", type: "date" }),

    // Case-felter. Alle er valgfri — uden dem er projektsiden som før. Udfyldes
    // de, bliver siden til en case: hvad opgaven var, og hvordan den er løst.
    defineField({ name: "role", title: "Min rolle", type: "string", group: "case" }),
    defineField({ name: "challenge", title: "Udfordringen", type: "text", rows: 5, group: "case" }),
    defineField({ name: "solution", title: "Løsningen", type: "text", rows: 7, group: "case" }),
    defineField({
      name: "highlights",
      title: "Løsningen i punkter",
      type: "array",
      of: [{ type: "string" }],
      group: "case",
      description: "Korte, konkrete punkter — én ting pr. linje.",
    }),
    defineField({
      name: "facts",
      title: "Nøgletal",
      type: "array",
      group: "case",
      description: "Små fakta der vises som en stribe: Sprog → 4.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Etiket", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Værdi", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "result",
      title: "Resultatet",
      type: "text",
      rows: 4,
      group: "case",
      description: "Hvad kom der ud af det? Tal, hvis du har dem.",
    }),
    defineField({
      name: "gallery",
      title: "Galleri",
      type: "array",
      group: "case",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "caption", title: "Billedtekst", type: "string" })],
        },
      ],
    }),
  ],
  groups: [{ name: "case", title: "Case" }],
  orderings: [
    orderRankOrdering,
    { title: "Nyeste først", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image" },
  },
});
