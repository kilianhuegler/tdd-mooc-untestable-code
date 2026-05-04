import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValue } from "../src/testable2.mjs";

describe("Untestable 2: a dice game", () => {
  test("todo", () => {
    // TODO: write proper tests
    expect(diceHandValue()).to.be.a("number");
  });
});
