/**
 * Apply all SQL migrations in /database/migrations in lexical order.
 * Idempotent: each migration file is itself idempotent.
 */
import fs from "fs";
import path from "path";
import { pool } from "../src/config/db";

const MIGRATIONS_DIR = path.resolve(__dirname, "..", "..", "database", "migrations");

const main = async () => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log("No migrations directory found at", MIGRATIONS_DIR);
    process.exit(0);
  }
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`Found ${files.length} migration file(s).`);

  for (const f of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), "utf8");
    process.stdout.write(`→ ${f} ... `);
    try {
      await pool.query(sql);
      console.log("ok");
    } catch (e) {
      console.log("FAILED");
      console.error(e);
      process.exit(1);
    }
  }
  await pool.end();
  console.log("✅ Migrations complete.");
};

main();
