import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

/**
 * One place for secrets: the Next.js app's env file.
 * drizzle-kit runs with cwd = packages/db, so we reach over to apps/web.
 * Variables already present in the real environment always win.
 */
for (const file of ["../../apps/web/.env.local", "../../apps/web/.env", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/db",
  },
  strict: true,
  verbose: true,
});
