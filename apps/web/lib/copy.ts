import { FAKE_FRIEND_BELOW } from "./constants";

/** Cycled on the "creating your quiz" screen. */
export const CREATING_MESSAGES = [
  "Mixing the fun, almost done…",
  "Tying the bow, here we go…",
  "Stirring the pot, a quiz so hot…",
  "Counting the clues, no time to lose…",
  "Shaking the dice, this'll be nice…",
  "Hold tight, we're getting it right…",
] as const;

/** Cycled while a friend's answers are being checked. */
export const CHECKING_MESSAGES = [
  "Checking your picks, no tricks…",
  "Grading your guesses, no messes…",
  "Counting your wins, here it begins…",
  "Peeking at the key, wait and see…",
] as const;

/** Cycled on route-level loading skeletons. */
export const LOADING_LINES = [
  "Just a tick, we're picking the pick…",
  "Loading the fun, almost done…",
  "Dusting off the quiz, here it is…",
] as const;

export function shareMessage(url: string): string {
  return `Think you know me well? Take my quiz and tell! 👉 ${url}`;
}

export type Verdict = { emoji: string; title: string; line: string; tone: "great" | "ok" | "bad" };

export function verdictFor(score: number, total: number, ownerName: string): Verdict {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 1) {
    return {
      emoji: "🏆",
      title: "Perfect score, who could ask for more?",
      line: `You know ${ownerName} to the core — a bestie, for sure!`,
      tone: "great",
    };
  }
  if (ratio >= 0.8) {
    return {
      emoji: "🔥",
      title: "Sharp and tight, you got most right!",
      line: `${ownerName} is lucky to have you on their side.`,
      tone: "great",
    };
  }
  if (ratio >= 0.6) {
    return {
      emoji: "😎",
      title: "Not bad at all, you stood tall!",
      line: `A few more chats with ${ownerName} and you'll ace it all.`,
      tone: "ok",
    };
  }
  if (ratio >= 0.5) {
    return {
      emoji: "🙂",
      title: "Half-way there, with some flair!",
      line: `You know ${ownerName} a bit — time to hang out and sit.`,
      tone: "ok",
    };
  }
  if (ratio >= 0.3) {
    return {
      emoji: "😬",
      title: "Yikes — a little shaky, a little flaky!",
      line: `${ownerName} noticed. Maybe bring snacks next time.`,
      tone: "bad",
    };
  }
  return {
    emoji: "🚩",
    title: "Fake friend alert! That's gonna hurt!",
    line: `${ownerName}'s thumb is hovering over block. Quick — make your own quiz and fight back!`,
    tone: "bad",
  };
}

export function friendBadge(score: number, total: number): { emoji: string; label: string; tone: "great" | "ok" | "bad" } {
  if (score < FAKE_FRIEND_BELOW) return { emoji: "🚩", label: "Fake friend", tone: "bad" };
  if (total > 0 && score / total >= 0.8) return { emoji: "💙", label: "Real one", tone: "great" };
  return { emoji: "🙂", label: "Decent pal", tone: "ok" };
}
