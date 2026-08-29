/**
 * Beregner "pladefarven" for hvert ønskeliste-billede.
 *
 * Produktfotos fra webshops er fritlagt på en ensfarvet baggrund — som regel
 * hvid, men ikke altid. Viser vi dem med object-contain på en flade i en anden
 * farve, står fotoets egen baggrund som en synlig kasse midt i kortet.
 *
 * Scriptet aflæser derfor billedets randpixels og gemmer medianfarven på
 * dokumentet, så kortet kan bruge præcis dén farve som flade. Så bliver
 * overgangen mellem foto og kort usynlig.
 *
 * Kør efter at have tilføjet nye ønsker:
 *   node --env-file=.env --env-file=.env.local scripts/set-wish-plate.mjs
 */
import { createClient } from "next-sanity";
import sharp from "sharp";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const toHex = (n) => Math.round(n).toString(16).padStart(2, "0");
const median = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];

/** Medianfarven langs billedets fire kanter. */
async function edgeColor(buffer) {
  const size = 48;
  const { data } = await sharp(buffer)
    .resize(size, size, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const r = [];
  const g = [];
  const b = [];
  const at = (x, y) => {
    const i = (y * size + x) * 3;
    r.push(data[i]);
    g.push(data[i + 1]);
    b.push(data[i + 2]);
  };

  for (let x = 0; x < size; x++) {
    at(x, 0);
    at(x, size - 1);
  }
  for (let y = 1; y < size - 1; y++) {
    at(0, y);
    at(size - 1, y);
  }

  return `#${toHex(median(r))}${toHex(median(g))}${toHex(median(b))}`;
}

const wishes = await client.fetch(
  `*[_type == "wish" && defined(image)]{ _id, title, plateColor, "url": image.asset->url }`
);

if (wishes.length === 0) {
  console.log("Ingen ønsker med billede.");
}

for (const wish of wishes) {
  const res = await fetch(`${wish.url}?w=200&fit=max`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const color = await edgeColor(buffer);

  if (color === wish.plateColor) {
    console.log("uændret ", color, wish.title.slice(0, 44));
    continue;
  }

  await client.patch(wish._id).set({ plateColor: color }).commit();
  console.log("sat     ", color, wish.title.slice(0, 44));
}
