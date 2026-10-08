"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getResultsAction } from "@/app/actions";
import { Bear, Panda } from "@/components/mascots";
import { AdsterraAd } from "@/components/adsterra-ad";
import { BackLink, Shell } from "@/components/shell";
import { ShareActions } from "@/components/share-actions";
import { BigButton, Spinner, softButton } from "@/components/ui";
import { friendBadge } from "@/lib/copy";
import { getVisitorId } from "@/lib/visitor";
import type { OwnerResults } from "@/lib/server/quizzes";

type State = { status: "loading" } | { status: "ready"; data: Extract<OwnerResults, { ok: true }> } | { status: "denied" } | { status: "error" };

const MEDALS = ["🥇", "🥈", "🥉"] as const;
const BADGE_TONE = {
  great: "bg-green-100 text-green-700",
  ok: "bg-amber-100 text-amber-700",
  bad: "bg-pink-100 text-pink-600",
} as const;

export function ResultsView({ slug, ownerName, shareUrl }: { slug: string; ownerName: string; shareUrl: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [isRefreshing, startRefresh] = useTransition();

  const load = useCallback(async (): Promise<State> => {
    const result = await getResultsAction(slug, getVisitorId());
    if (result.ok) return { status: "ready", data: result };
    return { status: result.reason === "error" ? "error" : "denied" };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    load().then((next) => {
      if (!cancelled) setState(next);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  function refresh() {
    startRefresh(async () => {
      setState(await load());
    });
  }

  const back = <BackLink href={`/q/${slug}/share`} label="Back to share page" />;

  if (state.status === "loading") {
    return (
      <Shell back={back} busy>
        <div role="status" aria-live="polite" className="flex flex-1 flex-col gap-4 pt-2">
          <span className="sr-only">Loading scores…</span>
          <div className="h-24 animate-pulse rounded-3xl bg-white/90 shadow-[0_5px_0_rgba(201,214,230,0.9)]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-3xl bg-white/90 shadow-[0_5px_0_rgba(201,214,230,0.9)]" />
          ))}
          <p className="mt-auto pt-4 text-center font-display text-lg font-medium text-[#3b4a6b]/80">Counting the scores, no more bores…</p>
        </div>
      </Shell>
    );
  }

  if (state.status === "denied") {
    return (
      <Shell back={back}>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
          <Panda className="w-28" mood="smirk" />
          <h1 className="font-display text-3xl font-bold text-[#17213e]">Shh! Owner&apos;s eyes only.</h1>
          <p className="max-w-xs font-display text-lg font-medium text-[#3b4a6b]">
            These scores belong to {ownerName}. If that&apos;s you, open this page in the same browser you made the quiz in.
          </p>
          <Link href={`/q/${slug}`} className={softButton}>
            Take the quiz instead
          </Link>
        </div>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell back={back}>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
          <Bear className="w-28" mood="smirk" />
          <h1 className="font-display text-3xl font-bold text-[#17213e]">Couldn&apos;t load the scores</h1>
          <p className="font-display text-lg font-medium text-[#3b4a6b]">Our server tripped. Try again in a tick!</p>
          <BigButton onClick={refresh} pending={isRefreshing} pendingLabel="Trying…" noArrow>
            Try again
          </BigButton>
        </div>
      </Shell>
    );
  }

  const { friends, stillThinking } = state.data;

  return (
    <Shell back={back}>
      <div className="flex flex-1 flex-col gap-5 pt-2">
        <section className="animate-pop-in rounded-[2rem] border-[6px] border-white bg-white p-5 text-center shadow-[0_12px_28px_rgba(57,107,151,0.17)]">
          <h1 className="font-display text-[1.8rem] font-bold leading-tight text-[#17213e]">
            Who knows <span className="text-pink-500">{ownerName}</span> best?
          </h1>
          <p className="mt-1 font-display text-lg font-medium text-[#3b4a6b]">
            {friends.length === 0 ? "No scores yet" : `${friends.length} ${friends.length === 1 ? "friend has" : "friends have"} played`}
            {stillThinking > 0 && ` · ${stillThinking} still thinking 🤔`}
          </p>
        </section>

        {friends.length === 0 ? (
          <section className="animate-slide-up rounded-[2rem] bg-white/80 p-5 text-center">
            <p className="mb-4 font-display text-xl font-semibold text-[#17213e]">No answers yet — share the link, don&apos;t let it sink!</p>
            <ShareActions url={shareUrl} />
          </section>
        ) : (
          <ol className="flex flex-col gap-3">
            {friends.map((friend, i) => {
              const badge = friendBadge(friend.score, friend.total);
              return (
                <li
                  key={friend.id}
                  style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                  className="flex animate-slide-up items-center gap-3 rounded-[1.4rem] bg-white p-3 pr-4 shadow-[0_5px_0_#c9d6e6]"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf4ff] font-display text-xl font-bold text-[#2a8af6]">
                    {MEDALS[i] ?? `#${i + 1}`}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-xl font-bold text-[#17213e]">{friend.name}</span>
                    <span className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 font-display text-sm font-semibold ${BADGE_TONE[badge.tone]}`}>
                      {badge.emoji} {badge.label}
                    </span>
                  </span>
                  <span className="font-display text-2xl font-bold tabular-nums text-[#17213e]">
                    {friend.score}
                    <span className="text-base text-[#17213e]/50">/{friend.total}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        <button type="button" onClick={refresh} disabled={isRefreshing} className={`${softButton} mx-auto`}>
          {isRefreshing ? <Spinner className="size-5" /> : <span aria-hidden="true">↻</span>}
          {isRefreshing ? "Refreshing…" : "Refresh scores"}
        </button>

        {friends.length > 0 && (
          <section className="rounded-[2rem] bg-white/70 p-5">
            <p className="mb-3 text-center font-display text-lg font-semibold text-[#17213e]">Need more victims? Share again!</p>
            <ShareActions url={shareUrl} />
          </section>
        )}

        <AdsterraAd placement="banner" />
      </div>
    </Shell>
  );
}
