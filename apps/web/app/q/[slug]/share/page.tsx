import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Bear, Panda } from "@/components/mascots";
import { AdsterraAd } from "@/components/adsterra-ad";
import { Shell } from "@/components/shell";
import { ShareActions } from "@/components/share-actions";
import { VISITOR_COOKIE } from "@/lib/constants";
import { getQuizBySlug, getVisitorStatus } from "@/lib/server/quizzes";
import { getOrigin } from "@/lib/server/origin";
import { isSlug, isUuid } from "@/lib/validation";
import { RememberQuiz } from "./remember-quiz";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Share your quiz", robots: { index: false } };

type Props = { params: Promise<{ slug: string }> };

export default async function SharePage({ params }: Props) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const quiz = await getQuizBySlug(slug);
  if (!quiz) notFound();

  // Never stream the share screen to a friend. The only browser that may render
  // it is the one whose server-side visitor cookie created this quiz.
  const visitorId = (await cookies()).get(VISITOR_COOKIE)?.value;
  if (!isUuid(visitorId)) redirect(`/q/${slug}`);

  if (quiz.ownerVisitorId !== visitorId) {
    let target = `/q/${slug}`;
    try {
      const status = await getVisitorStatus(slug, visitorId);
      if (status?.kind === "completed") target = `/q/${slug}/done/${status.attemptId}`;
      else if (status?.kind === "play") target = `/q/${slug}/play/${status.attemptId}`;
    } catch (error) {
      console.error("[SharePage visitor status]", error);
    }
    redirect(target);
  }

  const url = `${await getOrigin()}/q/${slug}`;

  return (
    <Shell>
      <RememberQuiz slug={slug} ownerName={quiz.ownerName} />
      <div className="flex flex-1 flex-col gap-6 pt-2">
        <section className="animate-pop-in rounded-4xl border-[6px] border-white bg-white p-6 text-center shadow-[0_12px_28px_rgba(57,107,151,0.17)]">
          <div className="mx-auto flex w-fit items-end gap-1 relative" aria-hidden="true">
            <Bear className="w-20 animate-bob" mood="wink" />
            <Panda className="w-20 animate-bob [animation-delay:0.2s]" />
            <Image src="/doodle-10.svg" alt="" width={40} height={40} className="pointer-events-none absolute -left-22 top-4 z-20 -rotate-12 opacity-90" aria-hidden="true" />
            <Image src="/doodle-11.svg" alt="" width={35} height={35} className="pointer-events-none absolute -right-18 top-24 z-20 rotate-12 opacity-90" aria-hidden="true" />
            <Image src="/doodle-16.svg" alt="" width={38} height={38} className="pointer-events-none absolute -left-17 top-1/2 z-20 rotate-6 opacity-90" aria-hidden="true" />
            <Image src="/doodle-10.svg" alt="" width={32} height={32} className="pointer-events-none absolute -bottom-5 left-3 z-20 rotate-12 opacity-80" aria-hidden="true" />
            <Image src="/doodle-11.svg" alt="" width={36} height={36} className="pointer-events-none absolute -bottom-6 right-3 z-20 -rotate-12 opacity-80" aria-hidden="true" />
          </div>
          <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight text-[#17213e]">
            Share the link, <span className="text-pink-500">make &apos;em think!</span>
          </h1>
          <p className="mt-2 mb-5 font-display text-lg font-medium leading-snug text-[#3b4a6b]">
            Real ones will know, fake ones will blow! Your quiz is ready, {quiz.ownerName}.
          </p>
          <ShareActions url={url} />
        </section>

        <Link
          href={`/q/${slug}/results`}
          className="mx-auto inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-display text-lg font-semibold text-[#17213e] shadow-[0_4px_0_#c9d6e6] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff5fa2] active:translate-y-0.5 active:shadow-none"
        >
          See who&apos;s answered <span aria-hidden="true">→</span>
        </Link>

        <Link href="/create" className="mx-auto font-display text-lg font-semibold text-blue-1000 underline underline-offset-4">
          Make another quiz
        </Link>

        <AdsterraAd placement="banner" />

        <p className="mt-auto text-center font-display text-base font-medium text-[#3b4a6b]/80">
          Every friend gets the questions in a different order. Sneaky!
        </p>
      </div>
    </Shell>
  );
}
