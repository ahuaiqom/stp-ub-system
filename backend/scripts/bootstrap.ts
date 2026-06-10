/**
 * Initial database bootstrap.
 *
 *   1. Loads /database/000_schema_init.sql (idempotent)
 *   2. Runs all migrations
 *   3. Runs all seeds
 *
 * Use this on a fresh checkout: `npm run db:bootstrap`.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { pool } from "../src/config/db";

const SCHEMA_FILE = path.resolve(
  __dirname,
  "..",
  "..",
  "database",
  "000_schema_init.sql"
);

const main = async () => {
  if (!fs.existsSync(SCHEMA_FILE)) {
    console.error(`Schema file not found at ${SCHEMA_FILE}`);
    process.exit(1);
  }

  console.log(`→ applying schema ${path.basename(SCHEMA_FILE)}`);
  const sql = fs.readFileSync(SCHEMA_FILE, "utf8");
  await pool.query(sql);
  console.log("  schema ok ✓");
  await pool.end();

  execSync("npm run db:migrate", { stdio: "inherit" });
  execSync("npm run db:seed", { stdio: "inherit" });

  console.log("✅ Database bootstrap complete.");
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
