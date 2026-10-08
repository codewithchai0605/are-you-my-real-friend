"use server";

import { redirect } from "next/navigation";
import { GENDERS, type Gender } from "@repo/db";
import { QUIZ_LENGTH } from "@/lib/constants";
import { getQuestion, getOption, isOptionKey, type OptionKey } from "@/lib/questions";
import { cleanName, isSlug, isUuid } from "@/lib/validation";
import {
  createQuiz,
  getOwnerResults,
  getVisitorStatus,
  startAttempt,
  submitAttempt,
  type OwnerResults,
} from "@/lib/server/quizzes";

/**
 * Server Actions = the only write path from the browser. Every input is treated as
 * hostile: the client already validates, but we re-check everything here.
 *
 * On success these call redirect() (which never returns); they only *return* when
 * something went wrong, so callers can show the message.
 */
export type ActionError = { ok: false; error: string };

const GENERIC_ERROR = "Oops, something went wrong. Please try again in a moment!";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* ───────────────────────────── create quiz ───────────────────────────── */

export async function createQuizAction(input: unknown): Promise<ActionError> {
  if (!isRecord(input)) return { ok: false, error: GENERIC_ERROR };

  const ownerName = cleanName(input.name);
  if (!ownerName) return { ok: false, error: "Please enter a name (1–15 characters)." };
  if (!isUuid(input.visitorId)) return { ok: false, error: "We couldn't recognise this browser. Please refresh the page." };
  if (typeof input.gender !== "string" || !(GENDERS as readonly string[]).includes(input.gender)) {
    return { ok: false, error: "Please choose a gender." };
  }
  const gender = input.gender as Gender;

  if (!Array.isArray(input.picks) || input.picks.length !== QUIZ_LENGTH) {
    return { ok: false, error: `Please answer exactly ${QUIZ_LENGTH} questions.` };
  }

  const picks: Array<{ questionKey: string; optionKey: OptionKey }> = [];
  const seen = new Set<string>();
  for (const pick of input.picks as unknown[]) {
    if (!isRecord(pick) || typeof pick.questionKey !== "string" || !isOptionKey(pick.optionKey)) {
      return { ok: false, error: GENERIC_ERROR };
    }
    const question = getQuestion(pick.questionKey);
    if (!question || !getOption(question, pick.optionKey) || seen.has(question.key)) {
      return { ok: false, error: GENERIC_ERROR };
    }
    seen.add(question.key);
    picks.push({ questionKey: question.key, optionKey: pick.optionKey });
  }

  let slug: string;
  try {
    ({ slug } = await createQuiz({ visitorId: input.visitorId, ownerName, gender, picks }));
  } catch (error) {
    console.error("[createQuizAction]", error);
    return { ok: false, error: GENERIC_ERROR };
  }
  redirect(`/q/${slug}/share`); // outside try/catch: redirect() works by throwing
}

/* ───────────────────────────── start / play ───────────────────────────── */

export async function startAttemptAction(input: unknown): Promise<ActionError> {
  if (!isRecord(input)) return { ok: false, error: GENERIC_ERROR };

  const friendName = cleanName(input.name);
  if (!friendName) return { ok: false, error: "Please enter your name (1–15 characters)." };
  if (!isUuid(input.visitorId)) return { ok: false, error: "We couldn't recognise this browser. Please refresh the page." };
  if (!isSlug(input.slug)) return { ok: false, error: "That quiz link looks wrong." };
  const { slug, visitorId } = input;

  let target: string;
  try {
    const result = await startAttempt({ slug, visitorId, friendName });
    if (!result) return { ok: false, error: "We couldn't find that quiz. Check the link?" };
    target =
      result.kind === "owner"
        ? `/q/${slug}/share`
        : result.kind === "completed"
          ? `/q/${slug}/done/${result.attemptId}`
          : `/q/${slug}/play/${result.attemptId}`;
  } catch (error) {
    console.error("[startAttemptAction]", error);
    return { ok: false, error: GENERIC_ERROR };
  }
  redirect(target);
}

/**
 * Called on page load: has this browser already played / does it own this quiz? Never writes.
 *  - `target`: where to send the visitor instead of showing the "start" form (null = show the form)
 *  - `owner`:  true only if this browser's id created the quiz
 */
export async function checkVisitorAction(
  slug: unknown,
  visitorId: unknown,
): Promise<{ target: string | null; owner: boolean }> {
  if (!isSlug(slug) || !isUuid(visitorId)) return { target: null, owner: false };
  try {
    const status = await getVisitorStatus(slug, visitorId);
    if (!status) return { target: null, owner: false };
    if (status.kind === "owner") return { target: `/q/${slug}/share`, owner: true };
    if (status.kind === "completed") return { target: `/q/${slug}/done/${status.attemptId}`, owner: false };
    return { target: `/q/${slug}/play/${status.attemptId}`, owner: false };
  } catch (error) {
    console.error("[checkVisitorAction]", error);
    return { target: null, owner: false }; // on any failure just show the normal form
  }
}

export async function submitAttemptAction(input: unknown): Promise<ActionError> {
  if (!isRecord(input)) return { ok: false, error: GENERIC_ERROR };
  if (!isUuid(input.visitorId) || !isUuid(input.attemptId) || !isRecord(input.answers)) {
    return { ok: false, error: GENERIC_ERROR };
  }

  const answers: Record<string, string> = {};
  for (const [key, value] of Object.entries(input.answers)) {
    if (typeof value === "string") answers[key] = value;
  }

  let target: string;
  try {
    const result = await submitAttempt({ attemptId: input.attemptId, visitorId: input.visitorId, answers });
    if (!result.ok) {
      return {
        ok: false,
        error:
          result.reason === "forbidden"
            ? "This quiz attempt belongs to a different browser."
            : result.reason === "not-found"
              ? "We couldn't find your quiz attempt."
              : "Some answers didn't match the quiz. Please reload and try again.",
      };
    }
    target = `/q/${result.slug}/done/${input.attemptId}`;
  } catch (error) {
    console.error("[submitAttemptAction]", error);
    return { ok: false, error: GENERIC_ERROR };
  }
  redirect(target);
}

/* ─────────────────────────────── results ─────────────────────────────── */

/** Read-only, but it must run on the server so we can check the owner id. */
export async function getResultsAction(slug: unknown, visitorId: unknown): Promise<OwnerResults> {
  if (!isSlug(slug) || !isUuid(visitorId)) return { ok: false, reason: "not-found" };
  try {
    return await getOwnerResults(slug, visitorId);
  } catch (error) {
    console.error("[getResultsAction]", error);
    return { ok: false, reason: "error" };
  }
}
