"use client";

import { useEffect } from "react";
import { checkVisitorAction } from "@/app/actions";
import { getVisitorId, rememberQuiz } from "@/lib/visitor";

/**
 * Renders nothing. Saves this quiz in the browser (so the home page can send the owner
 * back here) — but only after the server confirms this browser's id really owns it.
 * Otherwise a friend who opened /share by guessing would be treated as the owner.
 */
export function RememberQuiz({ slug, ownerName }: { slug: string; ownerName: string }) {
  useEffect(() => {
    let cancelled = false;
    checkVisitorAction(slug, getVisitorId())
      .then(({ owner }) => {
        if (!cancelled && owner) rememberQuiz(slug, ownerName);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug, ownerName]);
  return null;
}
