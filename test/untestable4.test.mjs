import { afterEach, beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { PasswordService, PostgresUserDao } from "../src/testable4.mjs";

describe("Untestable 4: enterprise application", () => {
  let service;
  let fakeHasher;
  let fakeUsers;

  beforeEach(() => {
    fakeUsers = new Map();
    const fakeDao = {
      getById: async (userId) => fakeUsers.get(userId) ?? null,
      save: async (user) => {
        fakeUsers.set(user.userId, user);
      },
    };
    fakeHasher = {
      hashSync: (password) => `hashed:${password}`,
      verifySync: (hash, password) => hash === `hashed:${password}`,
    };
    service = new PasswordService(fakeDao, fakeHasher);
  });

  test("changes password when old password is correct", async () => {
    fakeUsers.set(1, { userId: 1, passwordHash: "hashed:oldPw" });

    await service.changePassword(1, "oldPw", "newPw");

    expect(fakeUsers.get(1).passwordHash).to.equal("hashed:newPw");
  });
});
