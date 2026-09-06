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

test("family har alle sider — og ønskelisten øverst", () => {
  for (const page of PROFILES.developer.pages) assert.ok(hasPage("family", page), `family mangler ${page}`);
  assert.equal(hasPage("family", "wishlist"), true);
  assert.equal(PROFILES.family.home.rows[0].cards[0].title, "Ønskeliste");
});

test("ønskelisten findes kun hos family; arbejdssiderne hos alle tre", () => {
  assert.deepEqual(profilesWithPage("wishlist"), ["family"]);
  assert.deepEqual(profilesWithPage("projects"), ["developer", "recruiter", "family"]);
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
