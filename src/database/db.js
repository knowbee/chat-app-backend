import "dotenv/config";
import pg from "pg";
import { dbActions } from "../utils";

const { NODE_ENV } = process.env;
const env =
  NODE_ENV === "test" || NODE_ENV === "dev" ? `_${NODE_ENV}`.toUpperCase() : "";

const config = {
  connectionString: process.env[`DATABASE_URL${env}`],
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on("connect", () => {
  console.log("connected to the Database");
});

const dropTables = async () => {
  const chatsTable = "DROP TABLE IF EXISTS chats";

  const usersTable = "DROP TABLE IF EXISTS users";

  const dropTablesQueries = `${chatsTable}; ${usersTable};`;

  await dbActions(pool, dropTablesQueries);
};
const createTables = async () => {
  const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

  const chatsTable = `CREATE TABLE IF NOT EXISTS
      chats(
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        created_by INTEGER NOT NULL REFERENCES users (id),
        participant INTEGER NOT NULL REFERENCES users (id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`;
  const createTablesQueries = `${usersTable}; ${chatsTable}`;

  await dbActions(pool, createTablesQueries);
};

export { dropTables, createTables, pool };

require("make-runnable");
