import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/testable1.mjs";

describe("Untestable 1: days until Christmas", () => {
  test("one day before Christmas", () => {
    const today = new Date(2024, 11, 24);
    expect(daysUntilChristmas(today)).to.equal(1);
  });
});
