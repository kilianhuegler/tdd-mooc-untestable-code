import { describe, test } from "vitest";
import { expect } from "chai";
import { parsePeopleCsv } from "../src/testable3.mjs";

// example input:
// Loid,Forger,,Male
// Anya,Forger,6,Female
// Yor,Forger,27,Female

describe("Untestable 3: CSV file parsing", () => {
  test("parse a row with fields", () => {
    const csv = "Yor,Forger,27,Female";
    expect(parsePeopleCsv(csv)).to.deep.equal([{ firstName: "Yor", lastName: "Forger", age: 27, gender: "f" }]);
  });
});
