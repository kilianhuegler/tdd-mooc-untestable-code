import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/testable1.mjs";

describe("Untestable 1: days until Christmas", () => {
  test("one day before Christmas", () => {
    const today = new Date(2024, 11, 24);
    expect(daysUntilChristmas(today)).to.equal(1);
  });

  test("Christmas", () => {
    const today = new Date(2024, 11, 25);
    expect(daysUntilChristmas(today)).to.equal(0);
  });

  test("one day after Christmas", () => {
    const today = new Date(2024, 11, 26);
    expect(daysUntilChristmas(today)).to.equal(364);
  });

  test("1st January 2024 - leap year", () => {
    const today = new Date(2024, 0, 1);
    expect(daysUntilChristmas(today)).to.equal(359);
  });

  test("1st January 2025 - non leap year", () => {
    const today = new Date(2025, 0, 1);
    expect(daysUntilChristmas(today)).to.equal(358);
  });
});
