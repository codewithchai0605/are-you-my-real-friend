export * from "./schema";
export { getDb, type Database, type Transaction } from "./client";

// Re-export the query helpers so apps don't need their own copy of drizzle-orm
// (two copies of drizzle-orm = confusing type errors).
export { and, asc, count, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
