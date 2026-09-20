import { test } from "node:test";
import assert from "node:assert/strict";
import { countTechnologies, techSlug } from "./tech-slug.ts";

test("techSlug giver stabile, URL-venlige nøgler", () => {
  assert.equal(techSlug("Next.js"), "next-js");
  assert.equal(techSlug("Tailwind CSS"), "tailwind-css");
  assert.equal(techSlug("  Node.js  "), "node-js");
  assert.equal(techSlug("Blå Ærø"), "bla-r");
  assert.equal(techSlug("!!!"), "");
});

test("countTechnologies tæller pr. teknologi, mest brugte først", () => {
  const counts = countTechnologies([
    { technologies: [{ name: "React" }, { name: "Next.js" }] },
    { technologies: [{ name: "Next.js" }] },
    { technologies: undefined },
  ]);
  assert.deepEqual(counts, [
    { slug: "next-js", name: "Next.js", count: 2 },
    { slug: "react", name: "React", count: 1 },
  ]);
});
