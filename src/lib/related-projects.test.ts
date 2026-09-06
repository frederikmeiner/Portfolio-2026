import { test } from "node:test";
import assert from "node:assert/strict";
import { relatedProjects, type ProjectLike } from "./related-projects.ts";

const t = (...ids: string[]) => ids.map((_id) => ({ _id }));
const a = { _id: "a", technologies: t("next", "ts", "sanity") };
const b = { _id: "b", technologies: t("next", "ts") }; // 2 fælles
const c = { _id: "c", technologies: t("next") }; // 1 fælles
const d = { _id: "d", technologies: t("php") }; // 0 fælles
const e = { _id: "e", featured: true, technologies: t("sanity") }; // 1 fælles, fremhævet
const f = { _id: "f", publishedAt: "2026-01-01", technologies: t("ts") }; // 1 fælles, nyere end c

test("rangerer efter antal fælles teknologier, udelader sig selv og nul-match", () => {
  const ids = relatedProjects(a, [a, b, c, d]).map((p) => p._id);
  assert.deepEqual(ids, ["b", "c"]);
});

test("uafgjort: fremhævet først, derefter nyeste dato", () => {
  const ids = relatedProjects(a, [a, c, e, f]).map((p) => p._id);
  assert.deepEqual(ids, ["e", "f", "c"]);
});

test("respekterer limit", () => {
  assert.equal(relatedProjects(a, [a, b, c, e, f], 2).length, 2);
});

test("tåler manglende technologies", () => {
  const x: ProjectLike = { _id: "x" };
  assert.deepEqual(relatedProjects(x, [a, b]), []);
});
