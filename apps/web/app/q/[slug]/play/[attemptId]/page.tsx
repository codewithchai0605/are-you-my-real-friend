import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { segmentAbout } from "@/lib/pronouns";
import { getPlayableAttempt } from "@/lib/server/quizzes";
import { isSlug, isUuid } from "@/lib/validation";
import { Player, type PlayerQuestion } from "./player";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Answer the quiz", robots: { index: false } };

type Props = { params: Promise<{ slug: string; attemptId: string }> };

export default async function PlayPage({ params }: Props) {
  const { slug, attemptId } = await params;
  if (!isSlug(slug) || !isUuid(attemptId)) notFound();

  const attempt = await getPlayableAttempt(attemptId);
  if (!attempt || attempt.quiz.slug !== slug) notFound();
  if (attempt.completed) redirect(`/q/${slug}/done/${attemptId}`);

  // Rendered on the server: wording, pronouns and this friend's own question order + two options.
  // Nothing in these props says which option is right – grading happens on the server too.
  const questions: PlayerQuestion[] = attempt.questions.map((q) => ({
    key: q.key,
    segments: segmentAbout(q.about, attempt.quiz.ownerName, attempt.quiz.gender),
    options: q.options,
  }));

  return <Player attemptId={attemptId} ownerGender={attempt.quiz.gender} questions={questions} />;
}
