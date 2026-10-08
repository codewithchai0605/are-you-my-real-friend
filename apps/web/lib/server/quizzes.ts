import "server-only";
import { cache } from "react";
import {
  and,
  asc,
  attemptQuestions,
  attempts,
  desc,
  eq,
  getDb,
  isNotNull,
  isNull,
  quizQuestions,
  quizzes,
  sql,
  type Gender,
} from "@repo/db";
import { QUIZ_LENGTH } from "../constants";
import { getOption, getQuestion, OPTION_KEYS, type OptionKey, type QuestionOption } from "../questions";
import { coinFlip, makeSlug, pickRandom, shuffle } from "./ids";

/* ────────────────────────────── helpers ────────────────────────────── */

/** Drizzle wraps driver errors (`DrizzleQueryError.cause`), so walk the chain. */
function pgErrorCode(err: unknown): string | undefined {
  let current: unknown = err;
  for (let depth = 0; depth < 4 && typeof current === "object" && current !== null; depth++) {
    const { code, cause } = current as { code?: unknown; cause?: unknown };
    if (typeof code === "string") return code;
    current = cause;
  }
  return undefined;
}
const isUniqueViolation = (err: unknown) => pgErrorCode(err) === "23505";

/* ────────────────────────────── quizzes ────────────────────────────── */

async function findQuizBySlug(slug: string) {
  const [quiz] = await getDb().select().from(quizzes).where(eq(quizzes.slug, slug)).limit(1);
  return quiz ?? null;
}

/** De-duplicated per request, so generateMetadata + the page share one query. */
export const getQuizBySlug = cache(findQuizBySlug);

export type CreateQuizInput = {
  visitorId: string;
  ownerName: string;
  gender: Gender;
  picks: ReadonlyArray<{ questionKey: string; optionKey: OptionKey }>;
};

export async function createQuiz(input: CreateQuizInput): Promise<{ slug: string }> {
  const db = getDb();

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = makeSlug();
    try {
      await db.transaction(async (tx) => {
        const [quiz] = await tx
          .insert(quizzes)
          .values({
            slug,
            ownerVisitorId: input.visitorId,
            ownerName: input.ownerName,
            gender: input.gender,
          })
          .returning({ id: quizzes.id });
        if (!quiz) throw new Error("Quiz insert returned no row");

        await tx.insert(quizQuestions).values(
          input.picks.map((pick, position) => ({
            quizId: quiz.id,
            questionKey: pick.questionKey,
            correctOptionKey: pick.optionKey,
            position,
          })),
        );
      });
      return { slug };
    } catch (err) {
      if (isUniqueViolation(err)) continue; // astronomically rare slug clash → roll a new slug
      throw err;
    }
  }
  throw new Error("Could not allocate a unique quiz link. Please try again.");
}

/* ────────────────────────────── attempts ───────────────────────────── */

export type StartAttemptResult =
  | { kind: "owner" }
  | { kind: "completed"; attemptId: string }
  | { kind: "play"; attemptId: string };

async function findAttempt(quizId: string, visitorId: string) {
  const [existing] = await getDb()
    .select({ id: attempts.id, completedAt: attempts.completedAt })
    .from(attempts)
    .where(and(eq(attempts.quizId, quizId), eq(attempts.visitorId, visitorId)))
    .limit(1);
  return existing ?? null;
}

/**
 * Called when a friend hits "start".
 *  - the owner opening their own link   → send them to their share page
 *  - a browser that already took it     → resume / show their score (one go per browser)
 *  - otherwise                          → build THEIR version of the quiz:
 *      a fresh random question order + the correct option and ONE random decoy per
 *      question, shown in random left/right order. Saved, so refreshing is stable.
 */
export async function startAttempt(input: {
  slug: string;
  visitorId: string;
  friendName: string;
}): Promise<StartAttemptResult | null> {
  const quiz = await findQuizBySlug(input.slug);
  if (!quiz) return null;
  if (quiz.ownerVisitorId === input.visitorId) return { kind: "owner" };

  const existing = await findAttempt(quiz.id, input.visitorId);
  if (existing) {
    return existing.completedAt
      ? { kind: "completed", attemptId: existing.id }
      : { kind: "play", attemptId: existing.id };
  }

  const db = getDb();
  const picks = await db
    .select({ questionKey: quizQuestions.questionKey, correct: quizQuestions.correctOptionKey })
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quiz.id));

  const order = shuffle(picks);

  try {
    const attemptId = await db.transaction(async (tx) => {
      const [attempt] = await tx
        .insert(attempts)
        .values({
          quizId: quiz.id,
          visitorId: input.visitorId,
          friendName: input.friendName,
          total: order.length,
        })
        .returning({ id: attempts.id });
      if (!attempt) throw new Error("Attempt insert returned no row");

      await tx.insert(attemptQuestions).values(
        order.map((pick, position) => ({
          attemptId: attempt.id,
          questionKey: pick.questionKey,
          position,
          decoyOptionKey: pickRandom(OPTION_KEYS.filter((key) => key !== pick.correct)),
          correctFirst: coinFlip(),
        })),
      );
      return attempt.id;
    });
    return { kind: "play", attemptId };
  } catch (err) {
    // Double-click / two tabs: the other request won the race, so just use theirs.
    if (isUniqueViolation(err)) {
      const raced = await findAttempt(quiz.id, input.visitorId);
      if (raced) {
        return raced.completedAt
          ? { kind: "completed", attemptId: raced.id }
          : { kind: "play", attemptId: raced.id };
      }
    }
    throw err;
  }
}

/** Read-only: where should this browser go for this quiz? (null = nothing yet, show the form) */
export async function getVisitorStatus(slug: string, visitorId: string): Promise<StartAttemptResult | null> {
  const quiz = await findQuizBySlug(slug);
  if (!quiz) return null;
  if (quiz.ownerVisitorId === visitorId) return { kind: "owner" };
  const existing = await findAttempt(quiz.id, visitorId);
  if (!existing) return null;
  return existing.completedAt
    ? { kind: "completed", attemptId: existing.id }
    : { kind: "play", attemptId: existing.id };
}

export type PlayableQuestion = {
  key: string;
  /** Third-person template with {name} / {he} / {his} / {him} tokens. */
  about: string;
  /** Exactly two options, already in this friend's display order. Never says which is right. */
  options: [QuestionOption, QuestionOption];
};

export type PlayableAttempt = {
  attemptId: string;
  completed: boolean;
  friendName: string;
  quiz: { slug: string; ownerName: string; gender: Gender };
  questions: PlayableQuestion[];
};

export async function getPlayableAttempt(attemptId: string): Promise<PlayableAttempt | null> {
  const db = getDb();

  const [row] = await db
    .select({
      friendName: attempts.friendName,
      completedAt: attempts.completedAt,
      quizId: attempts.quizId,
      slug: quizzes.slug,
      ownerName: quizzes.ownerName,
      gender: quizzes.gender,
    })
    .from(attempts)
    .innerJoin(quizzes, eq(attempts.quizId, quizzes.id))
    .where(eq(attempts.id, attemptId))
    .limit(1);
  if (!row) return null;

  const rows = await db
    .select({
      questionKey: attemptQuestions.questionKey,
      decoy: attemptQuestions.decoyOptionKey,
      correctFirst: attemptQuestions.correctFirst,
      correct: quizQuestions.correctOptionKey,
    })
    .from(attemptQuestions)
    .innerJoin(
      quizQuestions,
      and(eq(quizQuestions.quizId, row.quizId), eq(quizQuestions.questionKey, attemptQuestions.questionKey)),
    )
    .where(eq(attemptQuestions.attemptId, attemptId))
    .orderBy(asc(attemptQuestions.position));

  const questions = rows.map((r): PlayableQuestion => {
    const question = getQuestion(r.questionKey);
    const correct = question && getOption(question, r.correct);
    const decoy = question && getOption(question, r.decoy);
    if (!question || !correct || !decoy) {
      throw new Error(`Question "${r.questionKey}" is missing from the question bank`);
    }
    return {
      key: question.key,
      about: question.about,
      options: r.correctFirst ? [correct, decoy] : [decoy, correct],
    };
  });

  return {
    attemptId,
    completed: row.completedAt !== null,
    friendName: row.friendName,
    quiz: { slug: row.slug, ownerName: row.ownerName, gender: row.gender },
    questions,
  };
}

export type SubmitResult =
  | { ok: true; slug: string }
  | { ok: false; reason: "not-found" | "forbidden" | "invalid-answers" };

export async function submitAttempt(input: {
  attemptId: string;
  visitorId: string;
  answers: Readonly<Record<string, string>>;
}): Promise<SubmitResult> {
  const db = getDb();

  const [attempt] = await db
    .select({
      id: attempts.id,
      quizId: attempts.quizId,
      visitorId: attempts.visitorId,
      completedAt: attempts.completedAt,
      slug: quizzes.slug,
    })
    .from(attempts)
    .innerJoin(quizzes, eq(attempts.quizId, quizzes.id))
    .where(eq(attempts.id, input.attemptId))
    .limit(1);

  if (!attempt) return { ok: false, reason: "not-found" };
  if (attempt.visitorId !== input.visitorId) return { ok: false, reason: "forbidden" };
  if (attempt.completedAt) return { ok: true, slug: attempt.slug }; // already graded – idempotent

  const rows = await db
    .select({
      id: attemptQuestions.id,
      questionKey: attemptQuestions.questionKey,
      decoy: attemptQuestions.decoyOptionKey,
      correct: quizQuestions.correctOptionKey,
    })
    .from(attemptQuestions)
    .innerJoin(
      quizQuestions,
      and(eq(quizQuestions.quizId, attempt.quizId), eq(quizQuestions.questionKey, attemptQuestions.questionKey)),
    )
    .where(eq(attemptQuestions.attemptId, attempt.id));

  // Every question answered, and only with one of the two options that friend was shown.
  const graded: Array<{ id: string; chosen: string; isCorrect: boolean }> = [];
  for (const row of rows) {
    const chosen = input.answers[row.questionKey];
    if (chosen !== row.correct && chosen !== row.decoy) return { ok: false, reason: "invalid-answers" };
    graded.push({ id: row.id, chosen, isCorrect: chosen === row.correct });
  }
  if (graded.length === 0) return { ok: false, reason: "invalid-answers" };
  const score = graded.filter((g) => g.isCorrect).length;

  await db.transaction(async (tx) => {
    // The `completedAt IS NULL` guard makes concurrent double-submits harmless.
    const claimed = await tx
      .update(attempts)
      .set({ score, total: graded.length, completedAt: new Date() })
      .where(and(eq(attempts.id, attempt.id), isNull(attempts.completedAt)))
      .returning({ id: attempts.id });
    if (claimed.length === 0) return;

    // One round-trip for all answers.
    const values = sql.join(
      graded.map((g) => sql`(${g.id}::uuid, ${g.chosen}::varchar, ${g.isCorrect}::boolean)`),
      sql`, `,
    );
    await tx.execute(sql`
      UPDATE attempt_questions AS aq
      SET chosen_option_key = v.chosen, is_correct = v.is_correct
      FROM (VALUES ${values}) AS v(id, chosen, is_correct)
      WHERE aq.id = v.id
    `);
  });

  return { ok: true, slug: attempt.slug };
}

export type AttemptSummary = {
  attemptId: string;
  completed: boolean;
  friendName: string;
  score: number;
  total: number;
  quiz: { slug: string; ownerName: string; gender: Gender };
};

export async function getAttemptSummary(attemptId: string): Promise<AttemptSummary | null> {
  const [row] = await getDb()
    .select({
      friendName: attempts.friendName,
      score: attempts.score,
      total: attempts.total,
      completedAt: attempts.completedAt,
      slug: quizzes.slug,
      ownerName: quizzes.ownerName,
      gender: quizzes.gender,
    })
    .from(attempts)
    .innerJoin(quizzes, eq(attempts.quizId, quizzes.id))
    .where(eq(attempts.id, attemptId))
    .limit(1);
  if (!row) return null;

  return {
    attemptId,
    completed: row.completedAt !== null,
    friendName: row.friendName,
    score: row.score ?? 0,
    total: row.total ?? QUIZ_LENGTH,
    quiz: { slug: row.slug, ownerName: row.ownerName, gender: row.gender },
  };
}

/* ────────────────────────────── results ────────────────────────────── */

export type OwnerResults =
  | {
      ok: true;
      ownerName: string;
      gender: Gender;
      /** Friends who finished, best score first. */
      friends: Array<{ id: string; name: string; score: number; total: number; completedAt: string }>;
      /** Friends who opened the quiz but haven't finished. */
      stillThinking: number;
    }
  | { ok: false; reason: "not-found" | "not-owner" | "error" };

export async function getOwnerResults(slug: string, visitorId: string): Promise<OwnerResults> {
  const quiz = await findQuizBySlug(slug);
  if (!quiz) return { ok: false, reason: "not-found" };
  if (quiz.ownerVisitorId !== visitorId) return { ok: false, reason: "not-owner" };

  const db = getDb();
  const finished = await db
    .select({
      id: attempts.id,
      name: attempts.friendName,
      score: attempts.score,
      total: attempts.total,
      completedAt: attempts.completedAt,
    })
    .from(attempts)
    .where(and(eq(attempts.quizId, quiz.id), isNotNull(attempts.completedAt)))
    .orderBy(desc(attempts.score), asc(attempts.completedAt));

  const [pending] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(attempts)
    .where(and(eq(attempts.quizId, quiz.id), isNull(attempts.completedAt)));

  return {
    ok: true,
    ownerName: quiz.ownerName,
    gender: quiz.gender,
    friends: finished.map((f) => ({
      id: f.id,
      name: f.name,
      score: f.score ?? 0,
      total: f.total ?? QUIZ_LENGTH,
      completedAt: (f.completedAt ?? new Date()).toISOString(),
    })),
    stillThinking: pending?.n ?? 0,
  };
}
