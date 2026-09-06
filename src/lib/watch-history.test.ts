import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { WATCH_LIMIT, readHistory, recordVisit, storageKey, writeHistory, type WatchEntry } from "./watch-history.ts";

const e = (href: string, progress = 0, at = 1): WatchEntry => ({ href, title: href, progress, at });

test("nyt besøg lægges forrest", () => {
  const list = recordVisit([e("/a")], e("/b"));
  assert.deepEqual(list.map((x) => x.href), ["/b", "/a"]);
});

test("genbesøg flytter frem og beholder højeste progress", () => {
  const list = recordVisit([e("/a", 0.8, 1), e("/b")], e("/a", 0.3, 2));
  assert.equal(list[0].href, "/a");
  assert.equal(list[0].progress, 0.8);
  assert.equal(list[0].at, 2);
  assert.equal(list.length, 2);
});

test("progress klippes til 0..1", () => {
  assert.equal(recordVisit([], e("/a", 1.7))[0].progress, 1);
  assert.equal(recordVisit([], e("/a", -1))[0].progress, 0);
});

test("maks WATCH_LIMIT poster", () => {
  let list: WatchEntry[] = [];
  for (let i = 0; i < WATCH_LIMIT + 3; i++) list = recordVisit(list, e(`/${i}`));
  assert.equal(list.length, WATCH_LIMIT);
  assert.equal(list[0].href, `/${WATCH_LIMIT + 2}`);
});

test("storageKey er pr. profil", () => {
  assert.equal(storageKey("family"), "watch:family");
});

// localStorage findes ikke i node — en minimal attrap er nok til læs/skriv.
const store = new Map<string, string>();
beforeEach(() => store.clear());
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
};

test("read/write går gennem localStorage og tåler skrald", () => {
  assert.deepEqual(readHistory("family"), []);
  writeHistory("family", [e("/family/wishlist", 0.5)]);
  assert.equal(readHistory("family")[0].href, "/family/wishlist");
  store.set("watch:family", "{ikke json");
  assert.deepEqual(readHistory("family"), []);
});
