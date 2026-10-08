import type { Gender } from "@repo/db";

const PRONOUNS: Record<Gender, { he: string; his: string; him: string }> = {
  male: { he: "he", his: "his", him: "him" },
  female: { he: "she", his: "her", him: "her" },
};

export type Segment = { text: string; isName: boolean };

/**
 * Turns "What does {name} spend most of {his} money on?" into display segments,
 * so the UI can highlight just the name (like the pink underlined name in the design).
 * Plain data → safe to pass from a server component to a client component.
 */
export function segmentAbout(template: string, name: string, gender: Gender): Segment[] {
  const p = PRONOUNS[gender];
  return template
    .split(/(\{name\})/)
    .filter((part) => part.length > 0)
    .map((part) =>
      part === "{name}"
        ? { text: name, isName: true }
        : {
            text: part.replaceAll("{he}", p.he).replaceAll("{his}", p.his).replaceAll("{him}", p.him),
            isName: false,
          },
    );
}

export function pronounsFor(gender: Gender) {
  return PRONOUNS[gender];
}
