import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "portfolio-2026",
  title: "Portfolio 2026",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S, ctx) =>
        S.list()
          .title("Indhold")
          .items([
            S.documentTypeListItem("skill").title("Skills"),
            S.documentTypeListItem("project").title("Projekter"),
            S.documentTypeListItem("experience").title("Erfaringer"),
            orderableDocumentListDeskItem({ type: "inspiration", title: "Inspiration", S, context: ctx }),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
