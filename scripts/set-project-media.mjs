import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-05-23",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const SHOTS = process.env.SHOT_DIR;

// Screenshots af forsiden, taget headless i 1440×900 @2x
const shots = [
  "brand-by-hand", "gourmet-catering", "mollerup-golf-club", "politisport",
  "roende-hoejskole", "savoy-hotel", "silikatteknik", "stenhoej-hydraulik",
  "surfcafe", "turnpikes", "oelmanden", "ownersclub", "surfagency",
];

// Hero-videoer fundet på kundernes egne sites
const videos = {
  "project-brdr-gamsgaard": "https://wordpress.brdr-gamsgaard.dk/wp-content/uploads/2026/02/2941108-uhd_4096_2160_24fps-1.mp4",
  "project-hotel-de-ville": "https://hoteldeville.dk/wp-content/uploads/2025/01/7964688cfd055f1bbecd0972b4efbfa2179e96ff.mp4",
  "project-nordic-glass":   "https://nordicglass.nu/wp-content/uploads/2024/11/64df1dac6d67f48621883459_Nordic-glass-video-web-transcode.mp4",
  "project-ownersclub":     "https://ownersclub.dk/wp-content/uploads/2024/03/shutterstock_1067606210-1.mp4",
  "project-surfagency":     "https://pub-c82b0a62eb1149cda3747b385f951e96.r2.dev/Event_final_16_9.mp4",
};

const mutations = [];

for (const slug of shots) {
  const buf = readFileSync(`${SHOTS}/${slug}.jpg`);
  const asset = await client.assets.upload("image", buf, { filename: `${slug}.jpg` });
  mutations.push({
    patch: {
      id: `project-${slug}`,
      setIfMissing: { image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } },
    },
  });
  console.log(`↑ ${slug.padEnd(20)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB  →  ${asset._id}`);
}

for (const [id, videoUrl] of Object.entries(videos)) {
  mutations.push({ patch: { id, setIfMissing: { videoUrl } } });
}

await client.mutate(mutations);
console.log(`\n✓ ${shots.length} billeder + ${Object.keys(videos).length} videoer patchet`);
