/**
 * Skriver erfaringstidslinjen.
 *
 * De seks Brand by Hand-poster i CV'et (studiejob, to praktikforløb, deltid og
 * fuldtid) er lagt sammen til tre roller. Splittet fortæller en ansættelses-
 * historik; de tre roller fortæller en progression fra junior til senior.
 *
 * Tonen er bevidst talesprog. Et CV skal være formelt — en portfolio skal lyde
 * som et menneske man kunne finde på at ringe til.
 *
 * Kør: node --env-file=.env --env-file=.env.local scripts/seed-experience-v2.mjs
 */
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const ref = (id) => ({ _type: "reference", _ref: id, _key: id });

const ENTRIES = [
  {
    _id: "exp-bbh-senior",
    kind: "work",
    company: "Brand by Hand",
    role: "Senior Frontend Developer",
    startDate: "2025-01-01",
    current: true,
    description:
      "Jeg sidder på nogle af bureauets største kunder — Danida Fellowship Centre under Udenrigsministeriet, ICARS og Genan. Store sites med meget indhold, mange redaktører og krav der flytter sig undervejs.",
    highlights: [
      "Tager projekter hele vejen — fra første snak med kunden til det står live",
      "Lærer praktikanter op og hjælper dem ind i det rigtige projektarbejde",
      "Trækker nye projekter over på Next.js og TypeScript med WordPress som headless CMS",
      "Bliver hentet ind når noget skal bygges om eller løses i frontend",
    ],
    technologies: ["skill-nextjs", "skill-typescript", "skill-react", "skill-tailwind", "skill-wordpress", "skill-php"].map(ref),
  },
  {
    _id: "exp-bbh-webudvikler",
    kind: "work",
    company: "Brand by Hand",
    role: "Webudvikler",
    startDate: "2022-01-01",
    endDate: "2025-01-01",
    description:
      "Byggede kundeprojekter og webshops i WordPress og WooCommerce, og fik løbende de større og mere rodede opgaver. Læste professionsbachelor ved siden af.",
    highlights: [
      "Byggede hele wp-nordic.dk for søsterselskabet — abonnementssalg af deres egne WordPress-plugins",
      "Skrev et PHP-plugin, Widgets Erazer, fordi Elementor gav kunderne alt for mange knapper. Det styrer hvilke widgets der er fremme, alt efter brugerrolle",
      "Hægtede ACF på eksisterende temaer, så redaktørerne kunne mere uden at ringe til os",
      "Fik tunge sider til at loade hurtigere",
      "Rodede med React oven på WordPress som headless CMS, før vi begyndte at bruge det for alvor",
    ],
    technologies: ["skill-wordpress", "skill-woocommerce", "skill-php", "skill-scss", "skill-elementor", "skill-react", "skill-mysql"].map(ref),
  },
  {
    _id: "exp-bbh-junior",
    kind: "work",
    company: "Brand by Hand",
    role: "Junior webudvikler",
    startDate: "2021-04-01",
    endDate: "2021-12-31",
    description:
      "Startede som studiejob og fortsatte i praktik. Byggede og passede kundesites, og fik mine første rigtige PHP-opgaver.",
    highlights: [
      "Byggede webshop for Søhøjlandets Blomstergalleri med WooCommerce og AJAX-filtrering af produkter",
      "Tilpassede og lappede kundesites — en del responsivt fnidder",
      "Lærte ACF, SASS og PHP på rigtige opgaver i stedet for i en bog",
    ],
    technologies: ["skill-wordpress", "skill-woocommerce", "skill-php", "skill-scss", "skill-elementor"].map(ref),
  },
  {
    _id: "exp-jks",
    kind: "work",
    company: "JKS — Statens IT og HMF Group A/S",
    role: "IT-vikar",
    startDate: "2020-05-01",
    endDate: "2020-12-31",
    description:
      "To vikariater inden jeg begyndte at kode til daglig. Flyttede data over på en ny platform hos HMF Group, og skiftede hardware og opdaterede software hos Statens IT.",
  },
  {
    _id: "edu-bachelor",
    kind: "education",
    company: "Erhvervsakademi Aarhus",
    role: "Professionsbachelor i webudvikling",
    startDate: "2022-08-01",
    endDate: "2024-06-30",
    description: "Taget sideløbende med fuldtidsarbejde hos Brand by Hand.",
  },
  {
    _id: "edu-mmd",
    kind: "education",
    company: "Erhvervsakademi Aarhus",
    role: "Multimediedesigner",
    startDate: "2019-08-01",
    endDate: "2022-06-30",
  },
  {
    _id: "edu-eux",
    kind: "education",
    company: "Business College",
    role: "EUX",
    startDate: "2015-08-01",
    endDate: "2017-06-30",
  },
];

const old = await client.fetch(`*[_type == "experience" && !(_id in $keep)]._id`, {
  keep: ENTRIES.map((e) => e._id),
});

const tx = ENTRIES.reduce(
  (t, e) => t.createOrReplace({ _type: "experience", ...e }),
  old.reduce((t, id) => t.delete(id), client.transaction())
);
await tx.commit();

console.log(`slettede ${old.length} gamle poster, skrev ${ENTRIES.length} nye`);
