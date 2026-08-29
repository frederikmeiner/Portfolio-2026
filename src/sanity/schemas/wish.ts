import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const wish = defineType({
  name: "wish",
  title: "Ønskeliste",
  type: "document",
  fieldsets: [{ name: "details", title: "Detaljer", options: { columns: 2 } }],
  fields: [
    orderRankField({ type: "wish" }),
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Billede",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      description: "Link til produktet eller webshoppen",
    }),
    defineField({
      name: "plateColor",
      title: "Pladefarve",
      type: "string",
      readOnly: true,
      description:
        "Beregnes automatisk af scripts/set-wish-plate.mjs ud fra billedets kantfarve, så fotoets baggrund smelter sammen med kortet.",
    }),
    defineField({
      name: "brand",
      title: "Mærke",
      type: "string",
      fieldset: "details",
      description: "Fx Georg Jensen",
    }),
    defineField({
      name: "color",
      title: "Farve",
      type: "string",
      fieldset: "details",
      description: "Fx Klar, Sort, Navy",
    }),
    defineField({
      name: "colorHex",
      title: "Farveprøve",
      type: "string",
      fieldset: "details",
      description: "Valgfri hex-kode som #1a1a1a — vises som en lille farveprik ved farven",
    }),
    defineField({
      name: "size",
      title: "Størrelse",
      type: "string",
      fieldset: "details",
      description: "Fx 38 cl, Large, 42",
    }),
    defineField({
      name: "length",
      title: "Længde",
      type: "string",
      fieldset: "details",
      description: "Fx 45 cm",
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: "title", subtitle: "brand", media: "image" },
  },
});
