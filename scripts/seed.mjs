import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const skills = [
  { _id: "skill-react",      name: "React",        category: "Frontend",  order: 1 },
  { _id: "skill-nextjs",     name: "Next.js",       category: "Frontend",  order: 2 },
  { _id: "skill-typescript", name: "TypeScript",    category: "Frontend",  order: 3 },
  { _id: "skill-tailwind",   name: "Tailwind CSS",  category: "Frontend",  order: 4 },
  { _id: "skill-gsap",       name: "GSAP",          category: "Frontend",  order: 5 },
  { _id: "skill-elementor",  name: "Elementor",     category: "Frontend",  order: 6 },
  { _id: "skill-wordpress",  name: "WordPress",     category: "Backend",   order: 7 },
  { _id: "skill-woocommerce",name: "WooCommerce",   category: "Backend",   order: 8 },
  { _id: "skill-php",        name: "PHP",           category: "Backend",   order: 9 },
  { _id: "skill-sanity",     name: "Sanity",        category: "Backend",   order: 10 },
  { _id: "skill-mysql",      name: "MySQL",         category: "Database",  order: 11 },
  { _id: "skill-mongodb",    name: "MongoDB",       category: "Database",  order: 12 },
];

const projects = [
  {
    title: "AGENZ",
    description: "Til dette projekt udviklede jeg en visuelt imponerende og interaktiv hjemmeside for Agenz, et firma der tilbyder TikTok-markedsføring til andre virksomheder. Resultatet er en moderne og engagerende side med mange animationer, horisontale sliders, live-tællere og Ajax-implementering for en mere dynamisk brugeroplevelse. Agenz har nu en stærk digital tilstedeværelse.",
    technologies: ["skill-wordpress"],
    featured: true,
  },
  {
    title: "Booking Platform",
    description: "Sammen med min partner har jeg bygget en platform til booking af restaurantreservationer. Vi har udviklet en komplet CRUD-løsning, hvor frontend er bygget med React og backend med PHP og MySQL. Brugere kan oprette profiler og se deres kommende reservationer.",
    technologies: ["skill-react", "skill-php", "skill-mysql"],
    featured: false,
  },
  {
    title: "Brand by Hand",
    description: "Dynamisk digitalt bureau, specialiseret i skræddersyede løsninger på tværs af strategi, design og udvikling af hjemmesider og webshops.",
    technologies: ["skill-wordpress"],
    liveUrl: "https://brandbyhand.dk/",
    featured: true,
  },
  {
    title: "Brdr. Gamsgaard",
    description: "Unik tømrerhjemmeside bygget med Next.js 15, Tailwind og TypeScript med headless WordPress-integration, fokus på SEO og performance, der scorer 100 i alle Lighthouse-parametre.",
    technologies: ["skill-nextjs", "skill-typescript", "skill-tailwind", "skill-wordpress"],
    featured: true,
  },
  {
    title: "Full Stack Portfolio",
    description: "Dette portfolio er et full stack-projekt, hvor frontend er bygget med React og backend med Sanity V3. Der er oprettet flere schemas, og hjemmesiden har fem sektioner. Animations-sektionen er bygget med Framer Motion, og der er også tilføjet filtrering til cases.",
    technologies: ["skill-react", "skill-sanity"],
    featured: false,
  },
  {
    title: "Genan",
    description: "Til Genan, verdens største dæk-genanvender, har jeg udviklet en robust WordPress-løsning, der forener global branding med lokal relevans. Ved at benytte en Multisite-arkitektur kombineret med WPML har jeg skabt en platform, hvor komplekst indhold styres centralt, mens de enkelte regioner har friheden til at kommunikere målrettet.",
    technologies: ["skill-wordpress"],
    featured: true,
  },
  {
    title: "Golden Candidates",
    description: "På mit andet semester realiserede jeg Golden Candidates som et avanceret skoleprojekt. Ved hjælp af REMIX-frameworket og MongoDB oprettede vi en platform, der effektivt matcher praktikanter med praktikpladser. Projektet involverede avanceret brug af GitHub til versionsstyring og et Scrum board til opgavestyring.",
    technologies: ["skill-react", "skill-mongodb"],
    featured: false,
  },
  {
    title: "Gourmet Catering",
    description: "Gourmet Catering løfter dit arrangement til nye højder, så du kan være gæst ved din egen fest – uanset om det er en eksklusiv privat begivenhed eller et luksuriøst erhvervsarrangement. Med Gourmet Catering er intet overladt til tilfældighederne.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Hotel de Ville",
    description: "Hôtel de Ville inviterer til oplevelser udover det sædvanlige på Nordens Riviera. Her mødes nordisk design med international gastronomi, festlige barer og ikke mindst en helt unik SPA i 3 etager.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "KjærDesign",
    description: "Jeg skabte en brugervenlig WordPress-hjemmeside for KjærDesign, en indretningsarkitekt der præsenterer private hjem og erhvervsejendomme. Siden inkluderer sektioner med tekst, billeder, lister og sliders, og besøgende kan sortere efter ejendomstype. Der er også en serviceside med tilbud inden for indretningsdesign, farve- og materialerådgivning samt møbel- og belysningsdesign.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Kompositterrasse",
    description: "For kompositterrasse.dk har jeg skabt en webshop, hvor fokus er 100% på at gøre komplekse produktvalg enkle for kunden. Ved at kombinere et rent visuelt udtryk med en logisk købsrejse har jeg bygget en platform, der præsenterer tekniske byggematerialer på en inspirerende og overskuelig måde.",
    technologies: ["skill-woocommerce"],
    featured: false,
  },
  {
    title: "Mollerup Golf Club",
    description: "For Mollerup Golfklub udviklede jeg en WordPress-baseret hjemmeside, der harmoniserer klubbens traditionelle værdier med en moderne og brugervenlig digital platform. Siden har intuitiv navigation og struktureret indhold, optimeret med gennemtænkte SEO-elementer for at sikre synlighed.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Nordic Glass",
    description: "Hos Nordic Glass Solution lever og ånder vi for at realisere arkitektoniske drømme. Gennem udviklingen af helt unikke glas- og facadeløsninger gør vi det umulige muligt. Vi brænder for smukke detaljer, høj kvalitet og bæredygtige løsninger – og vi skaber resultater med æstetikken i fokus.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Ownersclub",
    description: "Dedikeret til at give deres medlemmer adgang til de mest eksklusive og eftertragtede vine på markedet. En eksklusiv digital platform for vinentusiaster.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Politisport",
    description: "Politisport er en omfattende hjemmeside, der viser resultater fra sportsarrangementer, som politiet har deltaget i – eksempelvis skydestævner eller nordiske fodboldmesterskaber. Hjemmesiden har flere arkivsider og en kalender med mulighed for at sortere efter dato og downloade filer.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Rønde Højskole",
    description: "Et ophold på Rønde Højskole er for dig, der søger inspiration til livet og uddannelse, og hvor du møder unge fra hele landet.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Savoy Hotel",
    description: "Sammen med en kollega skabte jeg Savoy Hotellets nye hjemmeside, der perfekt indfanger hotellets luksuriøse essens. Med nøje udvalgte animationer via GSAP og en glidende navigation takket være Locomotive Scroll har vi skabt en digital oplevelse, der står mål med hotellets prestigefyldte atmosfære.",
    technologies: ["skill-wordpress", "skill-gsap"],
    featured: true,
  },
  {
    title: "Silikatteknik",
    description: "Silikatteknik er en WooCommerce-webshop specialiseret i malerartikler med sektioner bygget med ACF. Hjemmesiden har et minimalistisk og brugervenligt layout med fokus på kvalitetsprodukter og professionel vejledning.",
    technologies: ["skill-woocommerce"],
    featured: false,
  },
  {
    title: "Stenhøj Hydraulik",
    description: "Teknologidrevet virksomhed, der tilstræber at være førende på markedet med kreative tekniske løsninger på komplekse udfordringer. En professionel WordPress-hjemmeside med fokus på virksomhedens kompetencer.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Surfagency",
    description: "Ved hjælp af Elementor og ACF skabte jeg en brugervenlig hjemmeside for Surfagency med et frisk, moderne design og nemme redigeringsmuligheder. Det farverige layout fremhæver Surfagencys tilbud og adskiller dem fra konkurrenterne. Hjemmesiden er mobilresponsiv og sikrer en problemfri oplevelse på alle enheder.",
    technologies: ["skill-elementor"],
    featured: false,
  },
  {
    title: "Surfcafe",
    description: "SurfCafes hjemmeside er bygget med Elementor og ACF og har et frisk, moderne design med arkivsider, der er lette at navigere. Siden præsenterer menukortet og cafémiljøet i en attraktiv farvepalette med optimeret layout og funktionalitet.",
    technologies: ["skill-elementor"],
    featured: false,
  },
  {
    title: "Turnpikes",
    description: "Turnpikes' visuelt imponerende hjemmeside har flotte sliders, animationer og en fængende hero-sektion, der skaber en dynamisk online oplevelse. Det moderne design imponerer kunder og fungerer som en stærk digital præsentation af virksomheden.",
    technologies: ["skill-wordpress"],
    featured: false,
  },
  {
    title: "Vinoble",
    description: "Jeg har udviklet Vinobles nye webshop med et stilrent og moderne design, hvor der er fokus på brugervenlighed, hurtig navigation og en intuitiv købsoplevelse. Webshoppen er skabt for at gøre det nemt for kunderne at udforske og finde det rette produkt i et visuelt indbydende og responsivt layout.",
    technologies: ["skill-woocommerce"],
    featured: false,
  },
  {
    title: "WP-Nordic",
    description: "For WPNordic har jeg bygget en elegant WooCommerce-side med responsivt design, der tilbyder WordPress-plugins via abonnement. Den fremtrædende Min konto-sektion giver en dynamisk og brugervenlig grænseflade til håndtering af abonnementer og licenser, forbedret med flydende animationer.",
    technologies: ["skill-woocommerce"],
    featured: false,
  },
  {
    title: "Ølmanden",
    description: "Ølmanden er en WooCommerce-webshop der tilbyder udlejning af ølanlæg samt salg af diverse ølfustager. Hjemmesiden er bygget i forskellige sektioner ved hjælp af ACF, hvilket giver en klar og brugervenlig oplevelse. Med fokus på ølkultur og festlige arrangementer er Ølmanden det ideelle valg for dem, der vil tilføje lidt ekstra til næste sammenkomst.",
    technologies: ["skill-woocommerce"],
    featured: false,
  },
];

async function seed() {
  console.log("Opretter skills...");
  await client.mutate(
    skills.map((s) => ({
      createOrReplace: {
        _type: "skill",
        _id: s._id,
        name: s.name,
        category: s.category,
        order: s.order,
      },
    }))
  );
  console.log(`✓ ${skills.length} skills oprettet`);

  console.log("Opretter projekter...");
  await client.mutate(
    projects.map((p) => ({
      createOrReplace: {
        _type: "project",
        _id: `project-${toSlug(p.title)}`,
        title: p.title,
        slug: { _type: "slug", current: toSlug(p.title) },
        description: p.description,
        technologies: p.technologies.map((id, j) => ({
          _type: "reference",
          _ref: id,
          _key: `tech-${j}`,
        })),
        ...(p.liveUrl ? { liveUrl: p.liveUrl } : {}),
        featured: p.featured,
        publishedAt: "2024-01-01",
      },
    }))
  );
  console.log(`✓ ${projects.length} projekter oprettet`);
  console.log("Færdig!");
}

seed().catch(console.error);
