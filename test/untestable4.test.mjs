import { afterAll, beforeEach, describe, test } from "vitest";
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

  test("throws error when old password is wrong", async () => {
    fakeUsers.set(1, { userId: 1, passwordHash: "hashed:correctPw" });

    let error;

    try {
      await service.changePassword(1, "wrongPw", "newPw");
    } catch (e) {
      error = e;
    }

    expect(error).to.be.an("error");
    expect(error.message).to.equal("wrong old password");
    expect(fakeUsers.get(1).passwordHash).to.equal("hashed:correctPw");
  });
});


describe("Untestable 4: PostgresUserDao", () => {
  let dao;

  beforeEach(async () => {
    dao = new PostgresUserDao({
      user: "untestable",
      host: "localhost",
      database: "untestable",
      password: "secret",
      port: 5432,
    });
    await dao.db.query("delete from users");
  });

  afterAll(async () => {
    await dao.close();
  });

  test("return null when user does not exist", async () => {
    const result = await dao.getById(999);
    expect(result).to.equal(null);
  });

  test("saves and retrieves a user", async () => {
    await dao.save({ userId: 1, passwordHash: "hashed:abc" });

    const result = await dao.getById(1);
    expect(result).to.deep.equal({ userId: 1, passwordHash: "hashed:abc" });
  });

  test("save updates existing user", async () => {
    await dao.save({ userId: 1, passwordHash: "hashed:first" });
    await dao.save({ userId: 1, passwordHash: "hashed:second" });

    const result = await dao.getById(1);
    expect(result.passwordHash).to.equal("hashed:second");
  });
});
