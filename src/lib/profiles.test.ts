import { test } from "node:test";
import assert from "node:assert/strict";
import { PROFILES, PROFILE_IDS, cardHref, hasPage, isProfileId, profilesWithPage } from "./profiles.ts";

test("de tre profiler findes med uændrede href", () => {
  assert.deepEqual(PROFILE_IDS, ["developer", "recruiter", "family"]);
  assert.equal(PROFILES.recruiter.href, "/recruiter");
  assert.equal(PROFILES.developer.href, "/developer");
  assert.equal(PROFILES.family.href, "/family");
  assert.equal(PROFILES.family.label, "Familie & venner");
});

test("family har kun det private", () => {
  assert.deepEqual(PROFILES.family.pages, ["wishlist", "music", "contact"]);
  assert.equal(hasPage("family", "projects"), false);
  assert.equal(hasPage("family", "wishlist"), true);
});

test("ønskelisten findes kun hos family", () => {
  assert.deepEqual(profilesWithPage("wishlist"), ["family"]);
  assert.deepEqual(profilesWithPage("projects"), ["developer", "recruiter"]);
});

test("isProfileId afviser ukendte", () => {
  assert.equal(isProfileId("family"), true);
  assert.equal(isProfileId("admin"), false);
});

test("cardHref løser page mod profilen og lader href være", () => {
  assert.equal(cardHref({ title: "", description: "", icon: "zap", gradient: "", page: "skills" }, "developer"), "/developer/skills");
  assert.equal(cardHref({ title: "", description: "", icon: "gift", gradient: "", href: "/family/wishlist" }, "recruiter"), "/family/wishlist");
});

test("alle kort på en forside peger på sider profilen har, eller på absolutte links", () => {
  for (const id of PROFILE_IDS) {
    for (const row of PROFILES[id].home.rows) {
      for (const card of row.cards) {
        if ("page" in card) assert.ok(hasPage(id, card.page), `${id}: kort '${card.title}' peger på ${card.page}`);
        else assert.ok(card.href.startsWith("/"), `${id}: '${card.title}' skal have relativ href`);
      }
    }
  }
});
