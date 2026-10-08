import { NAME_MAX } from "./constants";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\u0000-\u001f\u007f]/;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/**
 * Trims, collapses spaces and enforces 1–15 characters (emoji count as one).
 * Returns null when the name isn't acceptable.
 */
export function cleanName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const name = input.normalize("NFC").replace(/\s+/g, " ").trim();
  const length = [...name].length;
  if (length < 1 || length > NAME_MAX) return null;
  if (CONTROL_CHARS_RE.test(name)) return null;
  return name;
}

export function isSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]{6,16}$/.test(value);
}
