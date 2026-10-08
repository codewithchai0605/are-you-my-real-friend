import "server-only";
import { randomInt } from "node:crypto";

// No 0/o/1/l/i – easier to read aloud and type from a screenshot.
const SLUG_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function makeSlug(length = 8): string {
  let slug = "";
  for (let i = 0; i < length; i++) slug += SLUG_ALPHABET[randomInt(SLUG_ALPHABET.length)];
  return slug;
}

/** Fisher–Yates with a cryptographically secure RNG. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(items.length)]!;
}

export function coinFlip(): boolean {
  return randomInt(2) === 1;
}
