import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Projekt",
  type: "document",
  fields: [
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
    defineField({ name: "publishedAt", title: "Dato", type: "date" }),
  ],
  orderings: [{ title: "Nyeste først", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "description", media: "image" },
  },
});
