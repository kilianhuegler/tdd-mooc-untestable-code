import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValue } from "../src/testable2.mjs";

describe("Untestable 2: a dice game", () => {
  test("pair", () => {
    const stubRandom = () => 0.5;
    expect(diceHandValue(stubRandom)).to.equal(104);
  });

  test("high die", () => {
    let callCount = 0;
    const stubRandom = () => {
      callCount++;
      return callCount === 1 ? 0.0 : 0.5;
    };
    expect(diceHandValue(stubRandom)).to.equal(4);
  })
});
