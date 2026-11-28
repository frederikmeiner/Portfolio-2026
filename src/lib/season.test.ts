import { test } from "node:test";
import assert from "node:assert/strict";
import { christmasCountdown, daysUntilChristmasEve, isChristmasSeason } from "./season.ts";

test("julesæsonen går fra 15. november til helligtrekonger", () => {
  assert.equal(isChristmasSeason(new Date("2026-11-14T12:00:00Z")), false);
  assert.equal(isChristmasSeason(new Date("2026-11-15T12:00:00Z")), true);
  assert.equal(isChristmasSeason(new Date("2026-12-31T12:00:00Z")), true);
  assert.equal(isChristmasSeason(new Date("2027-01-06T12:00:00Z")), true);
  assert.equal(isChristmasSeason(new Date("2027-01-07T12:00:00Z")), false);
  assert.equal(isChristmasSeason(new Date("2026-07-01T12:00:00Z")), false);
});

test("datoen regnes i dansk tid, ikke UTC", () => {
  // 23:30 UTC den 14. november er allerede den 15. i København.
  assert.equal(isChristmasSeason(new Date("2026-11-14T23:30:00Z")), true);
});

test("nedtælling til juleaften", () => {
  assert.equal(daysUntilChristmasEve(new Date("2026-11-28T10:00:00Z")), 26);
  assert.equal(daysUntilChristmasEve(new Date("2026-12-24T10:00:00Z")), 0);
  assert.equal(daysUntilChristmasEve(new Date("2026-12-25T10:00:00Z")), null);
  assert.equal(christmasCountdown(new Date("2026-12-23T10:00:00Z")), "1 dag til juleaften");
  assert.equal(christmasCountdown(new Date("2026-12-24T10:00:00Z")), "Det er juleaften i dag");
  assert.equal(christmasCountdown(new Date("2026-12-01T10:00:00Z")), "23 dage til juleaften");
});
