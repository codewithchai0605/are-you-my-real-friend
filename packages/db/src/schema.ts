import {
  boolean,
  index,
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const GENDERS = ["male", "female"] as const;
export type Gender = (typeof GENDERS)[number];
export const genderEnum = pgEnum("gender", GENDERS);

/**
 * A quiz created by "user 1".
 *  - `slug` is the short, public id used in the share link (/q/<slug>).
 *  - `ownerVisitorId` is the crypto.randomUUID() the owner's browser keeps in
 *    localStorage. It is how we recognise the owner when they come back.
 */
export const quizzes = pgTable(
  "quizzes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 16 }).notNull().unique(),
    ownerVisitorId: uuid("owner_visitor_id").notNull(),
    ownerName: varchar("owner_name", { length: 15 }).notNull(),
    gender: genderEnum("gender").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("quizzes_owner_visitor_idx").on(t.ownerVisitorId)],
);

/**
 * The 10 questions the owner picked, each with the option they said is TRUE.
 * `questionKey` / `correctOptionKey` point into the question bank in code
 * (apps/web/lib/questions.ts), so question wording can be edited freely.
 */
export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    questionKey: varchar("question_key", { length: 40 }).notNull(),
    correctOptionKey: varchar("correct_option_key", { length: 8 }).notNull(),
    position: smallint("position").notNull(),
  },
  (t) => [uniqueIndex("quiz_questions_quiz_question_uq").on(t.quizId, t.questionKey)],
);

/**
 * One friend taking one quiz. A browser (visitorId) can only attempt a quiz once.
 */
export const attempts = pgTable(
  "attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    visitorId: uuid("visitor_id").notNull(),
    friendName: varchar("friend_name", { length: 15 }).notNull(),
    score: smallint("score"),
    total: smallint("total"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("attempts_quiz_visitor_uq").on(t.quizId, t.visitorId),
    index("attempts_quiz_idx").on(t.quizId),
  ],
);

/**
 * The exact questions a friend sees, in THEIR order, with THEIR two options:
 * the correct one plus one random decoy. Persisting this (instead of re-rolling
 * on every render) means a page refresh never changes what the friend sees.
 */
export const attemptQuestions = pgTable(
  "attempt_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => attempts.id, { onDelete: "cascade" }),
    questionKey: varchar("question_key", { length: 40 }).notNull(),
    position: smallint("position").notNull(),
    decoyOptionKey: varchar("decoy_option_key", { length: 8 }).notNull(),
    /** true → the correct option is shown first, false → the decoy is shown first */
    correctFirst: boolean("correct_first").notNull(),
    chosenOptionKey: varchar("chosen_option_key", { length: 8 }),
    isCorrect: boolean("is_correct"),
  },
  (t) => [
    uniqueIndex("attempt_questions_attempt_position_uq").on(t.attemptId, t.position),
    uniqueIndex("attempt_questions_attempt_question_uq").on(t.attemptId, t.questionKey),
  ],
);

export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
export type AttemptQuestion = typeof attemptQuestions.$inferSelect;
