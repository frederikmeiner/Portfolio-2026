/**
 * Case-indhold til de vigtigste projekter. Idempotent — kan køres igen.
 *
 *   node --env-file=.env --env-file=.env.local scripts/set-project-cases.mjs <mappe-med-galleri-jpg>
 *
 * Teksterne er skrevet ud fra det, der kan ses på de live sites (20. sep. 2026):
 * struktur, funktioner og tal fra sitenes egne REST-API'er. Der står ingen
 * resultater, for dem kan man ikke læse sig til udefra — feltet "Resultatet"
 * udfyldes i Studio. Et felt, der allerede er udfyldt i Studio, overskrives
 * KUN hvis scriptet køres med --force.
 *
 * Galleribilleder uploades kun, hvis projektet ikke har et galleri i forvejen.
 */
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const dir = process.argv[2];
const force = process.argv.includes("--force");
if (!dir) throw new Error("Angiv mappen med galleribillederne");

const CASES = {
  "danida-fellowship-centre": {
    role: "Udvikling — hos Brand by Hand",
    facts: [
      { label: "Historier i arkivet", value: "518" },
      { label: "Læringsaktiviteter", value: "61" },
      { label: "Indholdstyper", value: "9" },
      { label: "Lande i netværket", value: "16" },
    ],
    challenge:
      "Danida Fellowship Centre hører under Udenrigsministeriet og styrker viden og kapacitet hos partnere i Danmarks udviklingssamarbejde — gennem kurser, forskningsbevillinger og universitetspartnerskaber.\n\nSitet skal tjene meget forskellige brugere på én gang: kursister på vej til Danmark, forskere der søger bevillinger, universiteter og et netværk af tidligere fellows. Samtidig skal det bære et arkiv på flere hundrede historier, nyhedsbreve og rapporter uden at blive uoverskueligt.",
    solution:
      "Sitet er bygget i WordPress med Breakdance, og indholdet er modelleret som ni indholdstyper — historier, læringsaktiviteter, rapporter, nyhedsbreve, medarbejdere, kort og flere — frem for som løse sider. Det gør redaktørernes arbejde ensartet og lader det samme indhold dukke op de rigtige steder.\n\nArkivet, Story and Knowledge Hub, hentes gennem et REST-endpoint skrevet til formålet. Faner, kategorier og sortering skifter uden genindlæsning, og hvert udsnit har sin egen adresse. Kursusprogrammet er en tabel, man kan filtrere og printe, og som folder sig om til kort på mobil. Fellows-netværket ligger på et interaktivt verdenskort.",
    highlights: [
      "Story and Knowledge Hub med faner for historier, nyhedsbreve, e-læring og rapporter — drevet af et eget REST-endpoint med sideinddeling",
      "Filtre der følger fanen: kategorier bliver til årstal under nyhedsbreve og til rapporttyper under rapporter",
      "Dybe links i adressen, så et bestemt udsnit af arkivet kan deles",
      "Kursusoversigt med 61 aktiviteter, filter på tema og målgruppe og en funktion til at printe programmet",
      "Tabellen bliver til udfoldelige kort på mobil — med tastaturbetjening og aria-expanded",
      "Interaktivt verdenskort over 16 lande med beskrivelse og kontaktpersoner for de nationale netværk",
      "Medarbejderoversigt bygget fra REST-API'et, med faner pr. afdeling og link direkte til en person",
      "Søgning i fuld skærm og animationer med GSAP",
    ],
    gallery: [
      ["dfc-2.jpg", "Kursusprogrammet: filter på tema og målgruppe, og en printvenlig udgave."],
      ["dfc-1.jpg", "Story and Knowledge Hub — arkivet med faner, kategorier og sortering."],
      ["dfc-3.jpg", "Fellows-netværket på et interaktivt verdenskort."],
    ],
  },

  icars: {
    role: "Udvikling — hos Brand by Hand",
    facts: [
      { label: "Projekter", value: "80" },
      { label: "Lande med projekter", value: "36" },
      { label: "Ressourcer i vidensbanken", value: "141" },
      { label: "Filtre på projekter", value: "5" },
    ],
    challenge:
      "ICARS er en international organisation med hovedsæde i København, som sammen med lav- og mellemindkomstlande udvikler løsninger mod antimikrobiel resistens.\n\nPorteføljen vokser og går på tværs af lande, sektorer, regioner og temaer. Bevillingsgivere, forskere og partnere skal hurtigt kunne finde præcis de projekter og den viden, der er relevant for dem — og kunne sende fundet videre til en kollega.",
    solution:
      "Sitet er bygget i WordPress med Elementor, med egne indholdstyper for projekter, viden, team, bestyrelse og nyhedsbreve, og med fælles temaer på tværs, så indholdet hænger sammen.\n\nProjektdatabasen filtrerer direkte i browseren på fem dimensioner, og et interaktivt verdenskort fungerer som indgang: et klik på et land sætter filteret. Valg og sidetal gemmes i adressen. Vidensbanken genbruger samme model og tilføjer fritekstsøgning, og nyheder og nyhedsbreve bruger den samme filterkomponent med årstal.",
    highlights: [
      "Projektdatabase med fem flervalgsfiltre: land, sektor, region, projekttype og tema",
      "Interaktivt verdenskort i SVG — hover viser landet, klik filtrerer listen, og et panel tæller projekter efter status",
      "Filtre og sidetal gemmes i adressen, så en søgning kan deles eller bogmærkes",
      "Knowledge Hub med 141 ressourcer, live-søgning og filtre på region, sektor og 13 ressourcetyper",
      "Projektsider med detaljeboks for region, sektor, land, type og periode, partnere og link til næste projekt",
      "Team, bestyrelse og rådgivende forum som egne indholdstyper, grupperet efter afdeling",
      "Arkiv for nyheder og nyhedsbreve med årsfilter, og tilmelding via Gravity Forms med reCAPTCHA",
      "Én filterkomponent genbrugt på tværs af projekter, viden og nyheder",
    ],
    gallery: [
      ["icars-1.jpg", "Projektdatabasen: verdenskortet tæller projekter, og fem filtre snævrer listen ind."],
      ["icars-3.jpg", "Knowledge Hub med fritekstsøgning og filtre på region, sektor og ressourcetype."],
      ["icars-2.jpg", "En projektside med detaljeboks og partnere."],
    ],
  },

  genan: {
    role: "Udvikling — hos Brand by Hand",
    facts: [
      { label: "Sprogversioner", value: "5" },
      { label: "Domæner", value: "5" },
      { label: "Medarbejderprofiler", value: "137" },
      { label: "Lokationer", value: "7" },
    ],
    challenge:
      "Genan genanvender udtjente dæk til gummi, stål og tekstil og er en af verdens største af sin slags, med anlæg i flere lande.\n\nSitet taler til tre meget forskellige målgrupper — indkøbere af gummigranulat, leverandører af brugte dæk og jobsøgende — på fem markeder med hver sit domæne. Det må ikke betyde, at indholdet skal vedligeholdes fem steder.",
    solution:
      "Løsningen er bygget i WordPress med Elementor og WPML. Hver sprogversion har sit eget domæne — genan.com, .dk, .de, .pt og .us — med oversatte adresser og egne nyheder og stillingsopslag, mens struktur, design og komponenter styres ét sted.\n\nProdukterne præsenteres visuelt frem for i tabeller: en slider viser de syv kornstørrelser, hver med direkte adgang til datablade. Medarbejderoversigten hentes fra et REST-endpoint skrevet til formålet og kan filtreres på afdeling og land, og kontaktsidens afdelinger linker direkte ind i det rigtige udsnit.",
    highlights: [
      "Fem sprogversioner på hver sit domæne med oversatte adresser — amerikansk engelsk som sin egen version",
      "Mega-menu der er ens på tværs af sprog, så man finder rundt uanset marked",
      "Produktsider med slider over syv granulatstørrelser og direkte adgang til sigteanalyse, teknisk datablad og sikkerhedsdatablad",
      "Medarbejderoversigt med 137 profiler og filter på afdeling og land, drevet af et eget REST-endpoint",
      "Dybe links fra kontaktsiden direkte til den rigtige afdeling",
      "Tyre intake: modtagekrav, kontaktpersoner og åbningstider pr. anlæg samt formular til leverandører",
      "Jobsektion med filtre på land, by, kategori og ansættelsestype — og uopfordret ansøgning",
      "Nyhedsarkiv med filter på nyheder, pressemeddelelser og cases",
    ],
    gallery: [
      ["genan-1.jpg", "Granulat: en slider over syv kornstørrelser, hver med sine datablade."],
      ["genan-2.jpg", "Medarbejderoversigten med filter på afdeling og land."],
      ["genan-3.jpg", "Tyre intake — indgangen for leverandører af brugte dæk."],
    ],
  },

  kompositterrasse: {
    role: "Udvikling — hos Brand by Hand",
    facts: [
      { label: "3D-beregnere", value: "4" },
      { label: "Produkter", value: "169" },
      { label: "Kategorier", value: "47" },
      { label: "Guides og artikler", value: "49" },
    ],
    challenge:
      "Kompositterrasse.dk sælger terrassebrædder, hegn og beklædning i komposit til folk, der bygger selv.\n\nEn terrasse er ikke én vare. Det er en model, en farve, en længde — og derefter klips, strøer, skruer og kantlister i de rigtige mængder. Spørgsmålet kunden står med, er ikke \"hvad koster et bræt\", men \"hvad skal jeg bruge til mine 32 kvadratmeter\". Webshoppen skal svare på det.",
    solution:
      "Webshoppen er bygget i WooCommerce og Elementor på et eget child theme. Variantvælgeren er skrevet til formålet: farver vælges som billedprøver og længder som knapper, og prisen vises pr. kvadratmeter. På produktsiden taster man sit areal og får antallet af brædder ud fra den variant, man har valgt.\n\nFire 3D-beregnere — terrasse, hegn, fliser og beklædning — er bygget i Babylon.js som guider på op til syv trin. Man tegner sit projekt, ser det i 3D, og ender med en komplet materialeliste, der kan lægges direkte i kurven eller gemmes som PDF.",
    highlights: [
      "Fire 3D-beregnere i Babylon.js — terrasse, hegn, fliser og beklædning — som trin for trin-guider med form, mål og retning",
      "Beregneren ender i en materialeliste, der lægges direkte i kurven eller gemmes som PDF",
      "Egen variantvælger: farver som billedprøver, længder som knapper og pris pr. m²",
      "m²-beregner på produktsiden: tast arealet og få antal brædder ud fra den valgte længde og bredde",
      "Specifikationer der svarer på byggespørgsmål: pris pr. m² og løbende meter, klips pr. m² og strøafstand",
      "\"Tilbehør der passer til produktet\", datablad og montagevejledning på hver produktside",
      "Vareprøver som egen kategori, så man kan se farven, før man køber 40 kvadratmeter",
      "Tabel med mængderabat og \"køb for X kr. mere og få gratis fragt\" i kurven",
      "Live-søgning med kategorier og priser i forslagene, og uendelig scroll på kategorisiderne",
      "49 guides og artikler, inspirationsgalleri og FAQ i fem emner",
    ],
    gallery: [
      ["komposit-2.jpg", "Terrasseberegneren: tegn terrassen i 3D, trin for trin."],
      ["komposit-1.jpg", "Produktsiden med farveprøver, længder og m²-beregner."],
      ["komposit-4.jpg", "Hegnsberegneren — sving, højde og længde."],
    ],
  },

  vinoble: {
    role: "Udvikling — i samarbejde med kolleger hos Brand by Hand",
    facts: [
      { label: "Produkter", value: "2.561" },
      { label: "Butikker", value: "46" },
      { label: "Producenter", value: "342" },
      { label: "Kategorier", value: "62" },
    ],
    challenge:
      "Vinoble sælger vin og spiritus ud over det sædvanlige — gennem en webshop og et landsdækkende netværk af selvstændige butikker.\n\nMed over 2.500 varer skal kunden kunne finde den rigtige flaske hurtigt, også uden at kende navnet på den. Og salg af alkohol på nettet kræver en alderskontrol, der ikke vælter købet.",
    solution:
      "Webshoppen er bygget i WooCommerce og Elementor på et eget tema. Filtreringen er skrevet til formålet: et REST-endpoint leverer de færdige produktkort, så filtre på pris, land, producent, type og madforslag skifter uden genindlæsning, og adressen følger valget.\n\nProduktdata er udvidet med producenter og distrikter som egne taksonomier, så en vin kan fortælle, hvor den kommer fra, og linke til resten af producentens sortiment. Butikkerne har deres egen indholdstype med regioner og åbningstider, og alderskontrollen med MitID ligger i checkout, hvor den hører hjemme.",
    highlights: [
      "Produktfilter med prisslider, land, producent, produkttype og \"anbefales til\" — plus økologisk, biodynamisk, vegansk og alkoholfri",
      "Eget REST-endpoint til filteret, adresser der følger valget, og \"indlæs flere\" i stedet for sideskift",
      "Syv sorteringer, blandt andet årgang, flaskestørrelse og lager",
      "Produktsider med specifikationer, druesammensætning, madforslag, anmeldelser, tekst om producent og distrikt og produktark som PDF",
      "360°-visning af flasken",
      "Læg i kurv direkte fra produktlisten",
      "Butiksoversigt med 46 butikker, filter på region, åbningstider og en side pr. butik",
      "Live-søgning med billede og varenummer i forslagene",
      "Alderskontrol med MitID i checkout",
    ],
    gallery: [
      ["vinoble-1.jpg", "Kategorisiden: genveje til kategorier, filterpanel og sortering."],
      ["vinoble-2.jpg", "En produktside med anmeldelser, specifikationer og 360°-visning."],
      ["vinoble-3.jpg", "Butiksoversigten med åbningstider for hver butik."],
    ],
  },

  caolin: {
    role: "Udvikling fra bunden — WordPress og Breakdance",
    facts: [
      { label: "Behandlinger", value: "54" },
      { label: "Priser i prislisten", value: "116" },
      { label: "Sprog", value: "2" },
      { label: "Specialister", value: "5" },
    ],
    challenge:
      "Caolín er en klinik for plastikkirurgi og kosmetiske behandlinger nord for København. Et valg om plastikkirurgi træffes langsomt og med mange spørgsmål.\n\nSitet skal give ro og tillid, svare på det, patienten faktisk vil vide — pris, forløb, nedetid, og hvem der opererer — og gøre det let at booke en konsultation. På både dansk og engelsk.",
    solution:
      "Jeg har bygget sitet fra bunden i WordPress med Breakdance. Behandlingerne er fire indholdstyper med en fælles skabelon: nøglefakta øverst, en indholdsfortegnelse, før og efter, ofte stillede spørgsmål, forløbet trin for trin, de specialister der udfører behandlingen, og finansiering.\n\nDansk og engelsk kører som multisite, med dansk i roden og engelsk under /en/ med oversatte adresser. Oplevelsen er holdt rolig: video i fuld skærm, bløde overgange og smooth scroll med Lenis — som slår fra, hvis man har bedt om mindre bevægelse.",
    highlights: [
      "Behandlingsskabelon med nøglefakta (pris, operationstid, bedøvelse, nedetid), indholdsfortegnelse, før og efter, FAQ og forløb i fire trin",
      "54 behandlinger fordelt på plastikkirurgi, kosmetiske behandlinger, The Light Spa og dermatologi",
      "Prisliste med 116 priser, faner, live-søgning og tæller",
      "Før og efter-galleri grupperet efter behandling",
      "Specialistprofiler med video, CV, forskning og patientudsagn — koblet til de behandlinger, de udfører",
      "Trustpilot-anmeldelser i en karrusel skrevet uden afhængigheder",
      "Booking via GeckoBooking og finansieringsberegner fra Resurs Bank",
      "Dansk og engelsk som multisite med oversatte adresser og hreflang",
      "Smooth scroll med Lenis, der respekterer \"reducér bevægelse\"",
      "FAQ bygget med rigtige knapper og aria-expanded",
    ],
    gallery: [
      ["caolin-1.jpg", "En behandlingsside: hero, genveje og indholdsfortegnelse."],
      ["caolin-3.jpg", "Prislisten med faner og live-søgning."],
      ["caolin-2.jpg", "En specialistprofil."],
    ],
  },
};

const TEXT_FIELDS = ["role", "challenge", "solution", "highlights", "facts"];

for (const [slug, content] of Object.entries(CASES)) {
  const doc = await client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug });
  if (!doc) throw new Error(`Ukendt projekt: ${slug}`);

  const set = {};
  for (const field of TEXT_FIELDS) {
    const current = doc[field];
    const empty = current == null || (Array.isArray(current) && current.length === 0);
    if (!empty && !force) continue;
    set[field] =
      field === "facts" ? content.facts.map((f, i) => ({ _key: `fact-${i}`, _type: "object", ...f })) : content[field];
  }

  if (!doc.gallery?.length || force) {
    const images = [];
    for (const [file, caption] of content.gallery) {
      const path = join(dir, file);
      if (!existsSync(path)) throw new Error(`Mangler billede: ${path}`);
      const asset = await client.assets.upload("image", createReadStream(path), { filename: `${slug}-${file}` });
      images.push({ _key: file.replace(/\W/g, "-"), _type: "image", caption, asset: { _type: "reference", _ref: asset._id } });
    }
    set.gallery = images;
  }

  if (Object.keys(set).length === 0) { console.log("uændret:", slug); continue; }
  await client.patch(doc._id).set(set).commit();
  console.log("case sat:", slug, "→", Object.keys(set).join(", "));
}
