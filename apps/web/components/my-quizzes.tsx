"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { MY_QUIZZES_KEY } from "@/lib/constants";
import { parseRememberedQuizzes } from "@/lib/visitor";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readRaw(): string {
  try {
    return window.localStorage.getItem(MY_QUIZZES_KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * "Your quizzes" shortcut on the home page. Reads localStorage through
 * useSyncExternalStore: the server (and first client render) see "", so there's no
 * hydration mismatch, then the real list pops in.
 */
export function MyQuizzes() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const quizzes = useMemo(() => parseRememberedQuizzes(raw).slice(0, 3), [raw]);
  if (quizzes.length === 0) return null;

  return (
    <nav aria-label="Your quizzes" className="mt-5 w-full max-w-sm animate-slide-up rounded-3xl bg-white/80 p-3 shadow-[0_6px_16px_rgba(57,107,151,0.12)]">
      <p className="px-2 pb-1 font-display text-sm font-bold uppercase tracking-widest text-pink-500">your quizzes</p>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.slug}>
            <Link
              href={`/q/${quiz.slug}/results`}
              className="flex items-center justify-between gap-3 rounded-2xl px-2 py-2.5 font-display text-lg font-semibold text-[#17213e] transition hover:bg-sky-50 focus-visible:outline-4 focus-visible:outline-[#ff5fa2]"
            >
              <span className="truncate">{quiz.ownerName}&apos;s quiz</span>
              <span className="shrink-0 text-blue-1000">see scores →</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
