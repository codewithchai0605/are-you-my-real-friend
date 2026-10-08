"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { checkVisitorAction, startAttemptAction } from "@/app/actions";
import { BigButton, ErrorNote, NameField } from "@/components/ui";
import { NAME_MAX } from "@/lib/constants";
import { cleanName } from "@/lib/validation";
import { getVisitorId } from "@/lib/visitor";

export function StartForm({ slug, ownerName }: { slug: string; ownerName: string }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // Already played (or own this quiz)? Send them where they belong instead of showing the form.
  useEffect(() => {
    let cancelled = false;
    checkVisitorAction(slug, getVisitorId())
      .then(({ target }) => {
        if (cancelled) return;
        if (target) router.replace(target); // leave `checking` true: the form stays locked while we navigate
        else setChecking(false);
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const clean = cleanName(name);
    if (!clean) {
      setError("Pop in your name to play the game!");
      return;
    }
    setError(null);
    startTransition(async () => {
      // Success → the Server Action redirect()s to the play page. We only get a value back on failure.
      const result = await startAttemptAction({ slug, name: clean, visitorId: getVisitorId() });
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <NameField
        id="friend-name"
        label="Your name"
        value={name}
        onChange={(v) => {
          setName(v);
          setError(null);
        }}
        placeholder="your name..."
        max={NAME_MAX}
        invalid={error !== null && !isPending}
      />
      {error && <ErrorNote>{error}</ErrorNote>}
      <BigButton type="submit" pending={isPending || checking} pendingLabel={checking ? "Checking…" : "Fetching questions…"} aria-label={`Start ${ownerName}'s quiz`}>
        start quiz
      </BigButton>
    </form>
  );
}
