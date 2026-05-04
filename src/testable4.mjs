// This code example is untestable because of two problems.
// The first problem is that it uses a singleton, which is global state in disguise,
// because PasswordService grabs PostgresUserDao.getInstance() in its field initializer.
// The second problem is that the database itself is a global variable and it is hard to test, because it needs a real database.
// To fix this, PasswordService can be tested in isolation with a fake Dao and a fake hasher,
// while PostgresUserDao is tested against the real Postgres from docker compose (no in-memory fake -> dead end).

import argon2 from "@node-rs/argon2";
import pg from "pg";

export class PostgresUserDao {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PostgresUserDao();
    }
    return this.instance;
  }

  db = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  close() {
    this.db.end();
  }

  #rowToUser(row) {
    return { userId: row.user_id, passwordHash: row.password_hash };
  }

  async getById(userId) {
    const { rows } = await this.db.query(
      `select user_id, password_hash
       from users
       where user_id = $1`,
      [userId]
    );
    return rows.map(this.#rowToUser)[0] || null;
  }

  async save(user) {
    await this.db.query(
      `insert into users (user_id, password_hash)
       values ($1, $2)
       on conflict (user_id) do update
           set password_hash = excluded.password_hash`,
      [user.userId, user.passwordHash]
    );
  }
}

export class PasswordService {
  constructor(users, hasher) {
    this.users = users;
    this.hasher = hasher;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.users.getById(userId);
    if (!this.hasher.verifySync(user.passwordHash, oldPassword)) {
      throw new Error("wrong old password");
    }
    user.passwordHash = this.hasher.hashSync(newPassword);
    await this.users.save(user);
  }
}
