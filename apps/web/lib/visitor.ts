import { MY_QUIZZES_KEY, VISITOR_KEY } from "./constants";
import { isSlug, isUuid } from "./validation";

/** Used only if localStorage is blocked (private mode, strict settings). */
let memoryId: string | null = null;

/**
 * crypto.randomUUID() only exists in secure contexts (https / localhost).
 * Testing on your phone over http://192.168.x.x would crash without this fallback.
 */
function newUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6]! & 0x0f) | 0x40; // version 4
  b[8] = (b[8]! & 0x3f) | 0x80; // variant 10xx
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * This browser's anonymous id. Created once with crypto.randomUUID(), then kept in
 * localStorage. Call it from event handlers / effects only (never during render).
 *
 * It is a *soft* identity – it lets us recognise a returning quiz owner and stop the
 * same browser answering a quiz twice. It is not authentication.
 */
export function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (isUuid(existing)) return existing;
    const fresh = newUuid();
    window.localStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    memoryId ??= newUuid();
    return memoryId;
  }
}

export type RememberedQuiz = { slug: string; ownerName: string };

/** Safe to call with anything (including "" or corrupt JSON). */
export function parseRememberedQuizzes(raw: string): RememberedQuiz[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((item): RememberedQuiz[] => {
      if (typeof item !== "object" || item === null) return [];
      const { slug, ownerName } = item as Record<string, unknown>;
      return isSlug(slug) && typeof ownerName === "string" ? [{ slug, ownerName }] : [];
    });
  } catch {
    return [];
  }
}

/** Remember a quiz this browser created, newest first (max 10). */
export function rememberQuiz(slug: string, ownerName: string): void {
  try {
    const current = parseRememberedQuizzes(window.localStorage.getItem(MY_QUIZZES_KEY) ?? "");
    const next = [{ slug, ownerName }, ...current.filter((q) => q.slug !== slug)].slice(0, 10);
    window.localStorage.setItem(MY_QUIZZES_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked – the share page still works, we just can't offer the shortcut */
  }
}
