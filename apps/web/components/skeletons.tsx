import type { ReactNode } from "react";
import { Shell } from "./shell";

/**
 * Route-level loading UIs (used by loading.tsx). Plain server components, so they
 * stream instantly while the real page is still talking to Postgres.
 * Lines are fixed (not random) so the server and browser always agree.
 */
function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-white/90 shadow-[0_5px_0_rgba(201,214,230,0.9)] ${className}`} aria-hidden="true" />;
}

function Frame({ line, children }: { line: string; children: ReactNode }) {
  return (
    <Shell busy>
      <div role="status" aria-live="polite" className="flex flex-1 flex-col gap-5">
        <span className="sr-only">Loading…</span>
        {children}
        <p className="mt-auto pt-4 text-center font-display text-lg font-medium text-[#3b4a6b]/80">{line}</p>
      </div>
    </Shell>
  );
}

/** Friend landing page: bubble, input, button. */
export function LandingSkeleton() {
  return (
    <Frame line="Loading the fun, almost done…">
      <Bone className="mt-4 h-36 w-full -rotate-2 bg-pink-100" />
      <Bone className="h-14 w-full rounded-full" />
      <Bone className="h-16 w-full bg-sky-300/70" />
    </Frame>
  );
}

/** Question screen: progress, notebook card, options. */
export function QuestionSkeleton() {
  return (
    <Frame line="Just a tick, we're picking the pick…">
      <Bone className="h-11 w-full rounded-full" />
      <Bone className="h-44 w-full" />
      <Bone className="h-28 w-full" />
      <Bone className="h-28 w-full" />
    </Frame>
  );
}

/** Score / share screens: one big card + a button. */
export function CardSkeleton() {
  return (
    <Frame line="Dusting off the quiz, here it is…">
      <Bone className="mt-2 h-72 w-full" />
      <Bone className="h-16 w-full bg-sky-300/70" />
    </Frame>
  );
}

/** Results list. */
export function ListSkeleton() {
  return (
    <Frame line="Counting the scores, no more bores…">
      <Bone className="mt-2 h-24 w-full" />
      <Bone className="h-20 w-full" />
      <Bone className="h-20 w-full" />
      <Bone className="h-20 w-full" />
    </Frame>
  );
}
