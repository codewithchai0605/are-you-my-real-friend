"use client";

import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import type { Gender } from "@repo/db";
import { submitAttemptAction } from "@/app/actions";
import { FunLoader } from "@/components/loaders";
import { Bear } from "@/components/mascots";
import { NotebookCard, OptionCard, ProgressBar } from "@/components/quiz-card";
import { BackButton, Shell } from "@/components/shell";
import { BigButton, ErrorNote, Wave } from "@/components/ui";
import { CHECKING_MESSAGES } from "@/lib/copy";
import type { QuestionOption } from "@/lib/questions";
import type { Segment } from "@/lib/pronouns";
import { getVisitorId } from "@/lib/visitor";

export type PlayerQuestion = { key: string; segments: Segment[]; options: [QuestionOption, QuestionOption] };

export function Player({ attemptId, ownerGender, questions }: { attemptId: string; ownerGender: Gender; questions: PlayerQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<number | null>(null);

  const total = questions.length;
  const question = questions[index];

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  function submit(final: Record<string, string>) {
    setError(null);
    setSubmitted(true);
    startTransition(async () => {
      // Success → redirect() to the score page. We only get a value back on failure.
      const result = await submitAttemptAction({ attemptId, visitorId: getVisitorId(), answers: final });
      if (!result.ok) setError(result.error);
    });
  }

  function pick(optionKey: string) {
    if (!question || selected) return;
    setSelected(optionKey);
    timer.current = window.setTimeout(() => {
      const next = { ...answers, [question.key]: optionKey };
      setAnswers(next);
      setSelected(null);
      if (index === total - 1) submit(next);
      else setIndex((i) => i + 1);
    }, 240);
  }

  function goBack() {
    if (selected || isPending) return;
    setSubmitted(false);
    setError(null);
    if (index > 0) setIndex((i) => i - 1);
  }

  if (isPending) {
    return (
      <Shell busy>
        <FunLoader messages={CHECKING_MESSAGES} title="Checking your answers…" />
      </Shell>
    );
  }

  if (submitted) {
    return (
      <Shell back={<BackButton onClick={goBack} label="Change my last answer" />}>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
          <Bear className="w-28" mood="smirk" />
          <h1 className="font-display text-3xl font-bold text-[#17213e]">Oh no, the quiz tripped!</h1>
          <p className="font-display text-lg font-medium text-[#3b4a6b]">Your answers are safe. Give it another go?</p>
          {error && <ErrorNote>{error}</ErrorNote>}
          <BigButton onClick={() => submit(answers)} noArrow>
            Try again
          </BigButton>
        </div>
      </Shell>
    );
  }

  if (!question) return null;

  return (
    <Shell back={index > 0 ? <BackButton onClick={goBack} label="Previous question" /> : undefined}>
      <div className="flex flex-1 flex-col gap-4">
        <ProgressBar current={index + 1} total={total} />
        <p className="sr-only" aria-live="polite">
          Question {index + 1} of {total}: {question.segments.map((s) => s.text).join("")}
        </p>

        <NotebookCard label={`Question ${index + 1}`} animateKey={question.key} mascot={ownerGender === "female" ? "panda" : "bear"}>
          <h1>
            {question.segments.map((segment, i) =>
              segment.isName ? (
                <span key={i} className="text-pink-500 underline decoration-sky-400 decoration-wavy decoration-[3px] underline-offset-[7px]">
                  {segment.text}
                </span>
              ) : (
                <Fragment key={i}>{segment.text}</Fragment>
              ),
            )}
          </h1>
        </NotebookCard>

        <div key={question.key} className="mt-2 flex flex-col gap-4">
          {question.options.map((opt, i) => (
            <OptionCard
              key={opt.key}
              index={i}
              emoji={opt.emoji}
              label={opt.label}
              selected={selected === opt.key || (selected === null && answers[question.key] === opt.key)}
              disabled={selected !== null}
              onSelect={() => pick(opt.key)}
            />
          ))}
        </div>

        <div className="mx-auto mt-3 flex flex-col items-center gap-1 text-center font-display text-sm font-medium text-[#3b4a6b]/80">
          <Wave className="text-sky-300" width={64} />
          <span>Two choices — only one is true!</span>
        </div>
      </div>
    </Shell>
  );
}
