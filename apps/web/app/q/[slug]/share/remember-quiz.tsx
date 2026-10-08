"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkVisitorAction } from "@/app/actions";
import { getVisitorId, rememberQuiz } from "@/lib/visitor";

/**
 * Renders nothing. Saves this quiz in the browser (so the home page can send the owner
 * back here) — but only after the server confirms this browser's id really owns it.
 * Otherwise a friend who opened /share by guessing would be treated as the owner.
 */
export function RememberQuiz({ slug, ownerName }: { slug: string; ownerName: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    checkVisitorAction(slug, getVisitorId())
      .then(({ owner, target }) => {
        if (cancelled) return;

        if (owner) {
          rememberQuiz(slug, ownerName);
          return;
        }

        // The share screen belongs only to the quiz creator. A friend with an
        // existing attempt resumes it (or sees their score); a new friend starts
        // from the public quiz page.
        router.replace(target ?? `/q/${slug}`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug, ownerName, router]);
  return null;
}
