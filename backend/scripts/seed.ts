/**
 * Apply seed SQL files, then upsert a real bcrypt hash for the
 * default admin account (so login works out of the box).
 *
 * Default admin credentials (change these after first login):
 *   username: admin
 *   password: admin123
 */
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { pool } from "../src/config/db";

const SEEDS_DIR = path.resolve(__dirname, "..", "..", "database", "seeds");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const main = async () => {
  if (fs.existsSync(SEEDS_DIR)) {
    const files = fs
      .readdirSync(SEEDS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const f of files) {
      const sql = fs.readFileSync(path.join(SEEDS_DIR, f), "utf8");
      process.stdout.write(`→ seed ${f} ... `);
      try {
        await pool.query(sql);
        console.log("ok");
      } catch (e) {
        console.log("FAILED");
        console.error(e);
        process.exit(1);
      }
    }
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await pool.query(
    `UPDATE users SET password = $1 WHERE username = $2`,
    [hash, ADMIN_USERNAME]
  );
  console.log(
    `✅ Default admin ready. username=${ADMIN_USERNAME} password=${ADMIN_PASSWORD}`
  );

  await pool.end();
};

main();
