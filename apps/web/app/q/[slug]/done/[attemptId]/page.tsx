import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Bear, Panda } from "@/components/mascots";
import { AdsterraAd } from "@/components/adsterra-ad";
import { Shell } from "@/components/shell";
import { BigLink, Wave } from "@/components/ui";
import { verdictFor } from "@/lib/copy";
import { getAttemptSummary } from "@/lib/server/quizzes";
import { isSlug, isUuid } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your score", robots: { index: false } };

type Props = { params: Promise<{ slug: string; attemptId: string }> };

const RING = { great: "#22c55e", ok: "#f59e0b", bad: "#ff4f81" } as const;

export default async function DonePage({ params }: Props) {
  const { slug, attemptId } = await params;
  if (!isSlug(slug) || !isUuid(attemptId)) notFound();

  const summary = await getAttemptSummary(attemptId);
  if (!summary || summary.quiz.slug !== slug) notFound();
  if (!summary.completed) redirect(`/q/${slug}/play/${attemptId}`);

  const { score, total, friendName, quiz } = summary;
  const verdict = verdictFor(score, total, quiz.ownerName);
  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <Shell>
      <div className="flex flex-1 flex-col gap-6 pt-4">
        <section className="animate-pop-in rounded-4xl border-[6px] border-white bg-white p-6 text-center shadow-[0_12px_28px_rgba(57,107,151,0.17)]">
          <p className="font-display text-xl font-semibold text-[#3b4a6b]">
            {friendName}, you scored
          </p>

          <div className="relative mx-auto my-4 size-44">
            <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden="true">
              <circle cx="64" cy="64" r={R} fill="none" stroke="#e8f1fb" strokeWidth="12" />
              <circle
                cx="64"
                cy="64"
                r={R}
                fill="none"
                stroke={RING[verdict.tone]}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - (total === 0 ? 0 : score / total))}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl" aria-hidden="true">
                {verdict.emoji}
              </span>
              <span className="font-display text-5xl font-bold leading-none text-[#17213e]">
                {score}
                <span className="text-3xl text-[#17213e]/50">/{total}</span>
              </span>
            </div>
          </div>
          <p className="sr-only">
            You got {score} out of {total} right.
          </p>

          <h1 className="font-display text-[1.7rem] font-bold leading-tight text-[#17213e]">{verdict.title}</h1>
          <p className="mt-2 font-display text-lg font-medium leading-snug text-[#3b4a6b]">{verdict.line}</p>
          <div className="mt-3 flex justify-center">
            <Wave className="text-pink-300" width={120} />
          </div>
        </section>

        <section className="relative animate-slide-up rounded-4xl bg-linear-to-br from-[#ffe3ee] to-[#ffeed1] p-6 text-center shadow-[0_10px_24px_rgba(240,98,146,0.15)] [animation-delay:150ms]">
          <div className="absolute -top-9 left-4 w-16 -rotate-12">{quiz.gender === "female" ? <Panda /> : <Bear mood="wink" />}</div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-pink-500">your turn!</p>
          <h2 className="mt-1 font-display text-[1.75rem] font-bold leading-tight text-[#17213e]">Now flip the script — make your own quiz!</h2>
          <p className="mt-2 mb-5 font-display text-lg font-medium text-[#3b4a6b]">Share it with your squad and see who really knows you true.</p>
          <BigLink href="/create">make my quiz</BigLink>
        </section>

        <AdsterraAd placement="rectangle" />
      </div>
    </Shell>
  );
}
