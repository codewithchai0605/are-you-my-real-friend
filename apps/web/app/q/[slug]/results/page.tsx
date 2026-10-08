import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuizBySlug } from "@/lib/server/quizzes";
import { getOrigin } from "@/lib/server/origin";
import { isSlug } from "@/lib/validation";
import { ResultsView } from "./results-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quiz results", robots: { index: false } };

type Props = { params: Promise<{ slug: string }> };

export default async function ResultsPage({ params }: Props) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const quiz = await getQuizBySlug(slug);
  if (!quiz) notFound();

  // The page frame is server-rendered. The scores themselves are fetched by the client
  // island, because only the browser knows the localStorage id that proves who the owner is.
  const url = `${await getOrigin()}/q/${slug}`;
  return <ResultsView slug={slug} ownerName={quiz.ownerName} shareUrl={url} />;
}
