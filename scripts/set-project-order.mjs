import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

// Rækkefølge + størrelse for bento-grid'et på /projects.
//
// 1-11 er præcis Inspirations egen rækkefølge og størrelser, så et projekt
// ser ens ud begge steder. 12-22 er sorteret så mosaikken pakker uden huller
// i 4 kolonner (verificeret med en simulering af CSS grid auto-placement).
// 23-24 har hverken billede eller video og ligger derfor bagerst.
//
// Efter denne kørsel kan rækkefølgen trækkes rundt i Studio → Projekter.
const layout = [
  ["project-genan",                "large"],
  ["project-kompositterrasse",     "normal"],
  ["project-vinoble",              "tall"],
  ["project-brdr-gamsgaard",       "normal"],
  ["project-hotel-de-ville",       "normal"],
  ["project-roende-hoejskole",     "large"],
  ["project-agenz",                "normal"],
  ["project-kjaerdesign",          "normal"],
  ["project-savoy-hotel",          "normal"],
  ["project-gourmet-catering",     "large"],
  ["project-wp-nordic",            "normal"],
  ["project-brand-by-hand",        "normal"],
  ["project-surfcafe",             "normal"],
  ["project-silikatteknik",        "normal"],
  ["project-nordic-glass",         "large"],
  ["project-surfagency",           "large"],
  ["project-stenhoej-hydraulik",   "normal"],
  ["project-politisport",          "normal"],
  ["project-oelmanden",            "normal"],
  ["project-turnpikes",            "normal"],
  ["project-mollerup-golf-club",   "tall"],
  ["project-ownersclub",           "large"],
  ["project-full-stack-portfolio", "normal"],
  ["project-golden-candidates",    "normal"],
];

const mutations = layout.map(([id, size], i) => ({
  patch: {
    id,
    // Samme LexoRank-format som @sanity/orderable-document-list selv bruger,
    // med luft imellem så drag-and-drop kan indsætte nye ranks
    set: { size, orderRank: `0|${((i + 1) * 10000).toString(36).padStart(6, "0")}:` },
  },
}));

await client.mutate(mutations);
console.log(`✓ ${mutations.length} projekter fik size + orderRank`);
