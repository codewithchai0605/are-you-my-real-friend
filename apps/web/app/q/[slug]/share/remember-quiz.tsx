"use client";

import { useEffect } from "react";
import { rememberQuiz } from "@/lib/visitor";

/**
 * Renders nothing. SharePage already verified ownership on the server; this only
 * keeps a local shortcut to the quiz on the home page.
 */
export function RememberQuiz({ slug, ownerName }: { slug: string; ownerName: string }) {
  useEffect(() => {
    rememberQuiz(slug, ownerName);
  }, [slug, ownerName]);
  return null;
}
