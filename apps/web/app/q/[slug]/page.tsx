import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Bear, Panda } from "@/components/mascots";
import { AdsterraAd } from "@/components/adsterra-ad";
import { BackLink, Shell } from "@/components/shell";
import { SpeechBubble } from "@/components/ui";
import { VISITOR_COOKIE } from "@/lib/constants";
import { getQuizBySlug, getVisitorStatus } from "@/lib/server/quizzes";
import { isSlug, isUuid } from "@/lib/validation";
import { StartForm } from "./start-form";

// Always render on the server per request (reads Postgres).
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const quiz = isSlug(slug) ? await getQuizBySlug(slug) : null;
  if (!quiz) return { title: "Quiz not found" };

  const title = `How well do you know ${quiz.ownerName}?`;
  const description = `Ten quick picks, two choices each. Real friends ace it, fake ones blow it!`;
  return { title, description, robots: { index: false, follow: true }, openGraph: { title, description, images: ["/share.jpg"] } };
}

export default async function QuizLandingPage({ params }: Props) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const quiz = await getQuizBySlug(slug);
  if (!quiz) notFound();

  // The visitor id is mirrored into an HTTP-only cookie by the Server Actions.
  // That allows returning owners and players to be redirected before the page UI
  // is rendered. The client-side check is retained only to migrate browsers that
  // still have an older localStorage-only id.
  const visitorId = (await cookies()).get(VISITOR_COOKIE)?.value;
  let target: string | null = null;
  if (isUuid(visitorId)) {
    try {
      const status = await getVisitorStatus(slug, visitorId);
      if (status?.kind === "owner") target = `/q/${slug}/share`;
      else if (status?.kind === "completed") target = `/q/${slug}/done/${status.attemptId}`;
      else if (status?.kind === "play") target = `/q/${slug}/play/${status.attemptId}`;
    } catch (error) {
      console.error("[QuizLandingPage visitor status]", error);
    }
  }
  if (target) redirect(target);

  return (
    <Shell back={<BackLink href="/" label="Back to home" />}>
      <div className="flex flex-1 flex-col gap-6 pt-8">
        <div className="relative flex items-end justify-between gap-2">
          <SpeechBubble className="w-[64%]">
            <h1 className="font-display text-[1.55rem] font-bold leading-tight text-[#17213e]">
              how well do you know
              <span className="mt-0.5 block wrap-break-word font-hand text-[2.3rem] font-normal leading-none text-pink-500">{quiz.ownerName}?</span>
            </h1>
          </SpeechBubble>
          {quiz.gender === "female" ? <Panda className="w-36 shrink-0 animate-bob" /> : <Bear className="w-36 shrink-0 animate-bob" />}
        </div>

        <p className="text-center font-display text-xl font-medium leading-snug text-[#3b4a6b]">
          Ten quick picks, two choices each.
          <br />
          One is right, one is a trick!
        </p>

        <StartForm slug={slug} ownerName={quiz.ownerName} />

        <AdsterraAd placement="banner" />

        <p className="mt-auto text-center font-display text-base font-medium text-[#3b4a6b]/80">
          Flunk it, and {quiz.ownerName} might hit block 🚫
        </p>
      </div>
    </Shell>
  );
}
