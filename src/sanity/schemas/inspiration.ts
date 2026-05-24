import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const inspiration = defineType({
  name: "inspiration",
  title: "Inspiration",
  type: "document",
  fields: [
    orderRankField({ type: "inspiration" }),
    defineField({
      name: "project",
      title: "Projekt",
      type: "reference",
      to: [{ type: "project" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "size",
      title: "Størrelse",
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
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: "project.title", subtitle: "project.description", media: "project.image" },
  },
});
