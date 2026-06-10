/**
 * Convenience: migrate + seed in one go. Useful during development.
 */
import { execSync } from "child_process";

try {
  execSync("npm run db:migrate", { stdio: "inherit" });
  execSync("npm run db:seed", { stdio: "inherit" });
} catch {
  process.exit(1);
}
