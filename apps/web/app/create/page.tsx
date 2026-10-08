import type { Metadata } from "next";
import { QUESTIONS } from "@/lib/questions";
import { CreateWizard } from "./create-wizard";

export const metadata: Metadata = {
  title: "Create your quiz",
  description: "Pick your answers, share the link, and see which friends really know you.",
};

/**
 * Server-rendered shell. The question bank is serialised into the page here, so the
 * wizard has its data on first paint with no client-side fetch (and no loading flash).
 * Only `ask` + options go to the browser — the friend-facing wording stays on the server.
 */
export default function CreatePage() {
  const questions = QUESTIONS.map(({ key, ask, options }) => ({ key, ask, options }));
  return <CreateWizard questions={questions} />;
}
