// This code example is untestable, because file reading and CSV parsing are coupled in one function.
// So the test always needs a real file even though the parsing logic itself has nothing to do with the file system.
// Edge cases like empty age or gender normalization cannot be tested with inline data.
// The fix is to split the function into two and decouple the file system from the parsing logic.
// One that reads the file and one that takes a CSV string and returns the parsed information.

import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

export async function parsePeopleCsv(filePath) {
  const csvData = await readFile(filePath, { encoding: "utf8" });
  const records = parse(csvData, {
    skip_empty_lines: true,
    trim: true,
  });
  return records.map(([firstName, lastName, age, gender]) => {
    const person = {
      firstName,
      lastName,
      gender: gender.charAt(0).toLowerCase(),
    };
    if (age !== "") {
      person.age = parseInt(age);
    }
    return person;
  });
}
