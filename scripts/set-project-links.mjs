import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-05-23",
  useCdn: false,
  // Skrive-token holdes adskilt fra frontend-token'en, der kun må læse
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

// Alle verificeret med HTTP 200 + <title> der matcher projektet
const links = {
  "project-hotel-de-ville":      "https://hoteldeville.dk/",
  "project-kjaerdesign":         "https://kjaerdesign.dk/",
  "project-kompositterrasse":    "https://kompositterrasse.dk/",
  "project-mollerup-golf-club":  "https://www.mollerupgolfclub.dk/",
  "project-nordic-glass":        "https://nordicglass.nu/",
  "project-oelmanden":           "https://oelmanden.dk/",
  "project-ownersclub":          "https://ownersclub.dk/",
  "project-politisport":         "https://politisport.dk/",
  "project-silikatteknik":       "https://silikatteknik.dk/",
  "project-stenhoej-hydraulik":  "https://stenhyd.com/",
  "project-surfagency":          "https://surfagency.dk/",
  "project-surfcafe":            "https://surfcafe.dk/",
  "project-turnpikes":           "https://turnpikes.pro/",
  "project-vinoble":             "https://vinoble.dk/",
  "project-wp-nordic":           "https://wpnordic.dk/",
};

const mutations = Object.entries(links).map(([id, liveUrl]) => ({
  patch: { id, setIfMissing: { liveUrl } },
}));

// AGENZ: opgrader http -> https (siden redirecter selv)
mutations.push({
  patch: { id: "project-agenz", set: { liveUrl: "https://www.agenz.dk/" } },
});

await client.mutate(mutations);

const after = await client.fetch(
  `*[_type == "project" && !defined(liveUrl)] { _id, title }`
);
console.log(`✓ ${mutations.length} projekter patchet`);
console.log(`Mangler stadig link: ${after.length ? after.map((p) => p.title).join(", ") : "ingen"}`);
