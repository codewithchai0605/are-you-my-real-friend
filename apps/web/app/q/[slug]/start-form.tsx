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

  if (checking) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 rounded-3xl bg-white/75 px-5 py-7 text-center shadow-[0_6px_16px_rgba(57,107,151,0.12)]">
        <div className="flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-3 animate-bounce rounded-full bg-pink-400" style={{ animationDelay: `${dot * 140}ms` }} />
          ))}
        </div>
        <p className="font-display text-xl font-semibold text-[#17213e]">Finding your quiz…</p>
        <p className="font-display text-base text-[#3b4a6b]">Getting you to the right place.</p>
      </div>
    );
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
      <BigButton type="submit" pending={isPending} pendingLabel="Fetching questions…" aria-label={`Start ${ownerName}'s quiz`}>
        start quiz
      </BigButton>
    </form>
  );
}
