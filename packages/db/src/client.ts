import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Cache = { db: ReturnType<typeof createDb> };
const globalForDb = globalThis as unknown as { __dbmDrizzle?: Cache };

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy apps/web/.env.example to apps/web/.env.local and fill it in.",
    );
  }
  const client = postgres(url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    // Safe with pgbouncer-style poolers (Supabase, Neon pooled, etc.)
    prepare: false,
  });
  return drizzle(client, { schema });
}

/**
 * Lazily creates ONE connection pool per server process (cached on globalThis so
 * Next.js hot-reload in dev doesn't leak connections). Nothing connects until the
 * first query, so `next build` works without a database.
 */
export function getDb() {
  globalForDb.__dbmDrizzle ??= { db: createDb() };
  return globalForDb.__dbmDrizzle.db;
}

export type Database = ReturnType<typeof getDb>;
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
