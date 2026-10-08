"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Gender } from "@repo/db";
import { createQuizAction } from "@/app/actions";
import { BackButton, BackLink, Shell } from "@/components/shell";
import { BigButton, ErrorNote, NameField, SpeechBubble, Wave } from "@/components/ui";
import { Bear, Panda } from "@/components/mascots";
import { NotebookCard, OptionCard, ProgressBar } from "@/components/quiz-card";
import { FunLoader } from "@/components/loaders";
import { CREATING_MESSAGES } from "@/lib/copy";
import { NAME_MAX, QUIZ_LENGTH } from "@/lib/constants";
import type { OptionKey, QuestionOption } from "@/lib/questions";
import { cleanName } from "@/lib/validation";
import { getVisitorId } from "@/lib/visitor";

type WizardQuestion = { key: string; ask: string; options: readonly QuestionOption[] };
type Step = "name" | "gender" | "questions";
type Pick = { questionKey: string; optionKey: OptionKey };

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function CreateWizard({ questions }: { questions: readonly WizardQuestion[] }) {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [gender, setGender] = useState<Gender | null>(null);
  /** Question keys still to show. Skipping moves the front one to the back. */
  const [queue, setQueue] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Pick[]>([]);
  /** The option being highlighted for a split second before we move on. */
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<number | null>(null);

  const byKey = useMemo(() => new Map(questions.map((q) => [q.key, q])), [questions]);
  const current = queue[0] ? byKey.get(queue[0]) : undefined;

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  /* ───────────── step 1: name ───────────── */
  function submitName(event: React.FormEvent) {
    event.preventDefault();
    const clean = cleanName(name);
    if (!clean) {
      setNameInvalid(true);
      return;
    }
    setNameInvalid(false);
    setName(clean);
    setStep("gender");
  }

  /* ───────────── step 2: gender ───────────── */
  function chooseGender(value: Gender) {
    setGender(value);
    setQueue(shuffled(questions.map((q) => q.key))); // different mix of questions each time
    setAnswers([]);
    setError(null);
    setStep("questions");
  }

  /* ───────────── step 3: questions ───────────── */
  function pick(optionKey: OptionKey) {
    if (!current || selected) return;
    setSelected(optionKey);
    timer.current = window.setTimeout(() => {
      const next = [...answers, { questionKey: current.key, optionKey }];
      setAnswers(next);
      setQueue((q) => q.slice(1));
      setSelected(null);
      if (next.length === QUIZ_LENGTH) submit(next);
    }, 240);
  }

  function skip() {
    if (selected || queue.length < 2) return;
    setQueue((q) => [...q.slice(1), q[0]!]);
  }

  function goBack() {
    if (selected || isPending) return;
    setError(null);
    if (step === "gender") return setStep("name");
    if (step === "questions") {
      const last = answers[answers.length - 1];
      if (!last) return setStep("gender");
      setAnswers((a) => a.slice(0, -1));
      setQueue((q) => [last.questionKey, ...q]);
    }
  }

  function submit(picks: Pick[]) {
    if (!gender) return;
    setError(null);
    startTransition(async () => {
      // On success the Server Action redirect()s to the share page, so we only land here on failure.
      const result = await createQuizAction({ visitorId: getVisitorId(), name, gender, picks });
      if (!result.ok) setError(result.error);
    });
  }

  const back = step === "name" ? <BackLink href="/" label="Back to home" /> : isPending ? null : <BackButton onClick={goBack} />;

  /* ───────────── rendering ───────────── */
  if (isPending) {
    return (
      <Shell busy>
        <FunLoader messages={CREATING_MESSAGES} title="Cooking up your quiz…" />
      </Shell>
    );
  }

  return (
    <Shell back={back}>
      {step === "name" && (
        <form onSubmit={submitName} noValidate className="flex flex-1 flex-col gap-6 pt-8">
          <div className="relative flex items-end justify-between gap-2">
            <SpeechBubble className="w-[64%]">
              <h1 className="font-display text-[1.6rem] font-bold leading-tight text-[#17213e]">
                what&apos;s your
                <span className="mt-0.5 block font-hand text-[2.6rem] font-normal leading-none text-pink-500">name?</span>
              </h1>
            </SpeechBubble>
            <Panda className="w-36 shrink-0 animate-bob" />
          </div>

          <NameField
            id="owner-name"
            label="Your name"
            value={name}
            onChange={(v) => {
              setName(v);
              setNameInvalid(false);
            }}
            placeholder="name..."
            max={NAME_MAX}
            invalid={nameInvalid}
            autoFocus
          />
          {nameInvalid && <ErrorNote>Pop in a name to play the game!</ErrorNote>}

          <BigButton type="submit" className="mt-2">
            continue
          </BigButton>
        </form>
      )}

      {step === "gender" && (
        <div className="flex flex-1 flex-col items-center gap-5 pt-6">
          <p className="animate-slide-up font-display text-xl font-semibold text-[#17213e]">
            hi, <span className="font-bold text-amber-500">{name}</span> 👋
          </p>
          <h1 className="rounded-[1.6rem] bg-white px-7 py-4 text-center font-display text-[1.9rem] font-bold shadow-[0_8px_20px_rgba(60,100,150,0.14)]">
            choose your <span className="text-sky-500 underline decoration-orange-400 decoration-wavy decoration-[3px] underline-offset-[10px]">gender</span>
          </h1>

          <div className="mt-6 grid w-full grid-cols-2 gap-4 px-1">
            {(
              [
                { value: "male", label: "Male", rotate: "-rotate-6", art: <Bear className="w-full" mood="smirk" /> },
                { value: "female", label: "Female", rotate: "rotate-6", art: <Panda className="w-full" /> },
              ] as const
            ).map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => chooseGender(g.value)}
                className={`group flex flex-col items-center gap-3 rounded-3xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff5fa2] ${g.rotate}`}
                aria-label={g.label}
              >
                <span className="block w-full rounded-[2rem] border-2 border-white bg-white px-3 pb-2 pt-6 shadow-[0_12px_26px_rgba(60,100,150,0.2)] transition duration-200 group-hover:-translate-y-1 group-hover:scale-[1.03] group-active:scale-95">
                  {g.art}
                </span>
                <span className="font-hand text-3xl text-[#17213e]">{g.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "questions" && answers.length >= QUIZ_LENGTH && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
          <Bear className="w-28" mood="smirk" />
          <h1 className="font-display text-3xl font-bold text-[#17213e]">Oh no, the quiz tripped!</h1>
          <p className="font-display text-lg font-medium text-[#3b4a6b]">Your answers are safe. Give it another go?</p>
          {error && <ErrorNote>{error}</ErrorNote>}
          <BigButton onClick={() => submit(answers)} noArrow>
            Try again
          </BigButton>
        </div>
      )}

      {step === "questions" && answers.length < QUIZ_LENGTH && current && (
        <div className="flex flex-1 flex-col gap-4">
          <ProgressBar current={answers.length + 1} total={QUIZ_LENGTH} />
          <p className="sr-only" aria-live="polite">
            Question {answers.length + 1} of {QUIZ_LENGTH}: {current.ask}
          </p>

          <NotebookCard label={`Question ${answers.length + 1}`} animateKey={current.key}>
            <h1>{current.ask}</h1>
          </NotebookCard>

          <div key={current.key} className="mt-2 flex flex-col gap-4">
            {current.options.map((opt, i) => (
              <OptionCard
                key={opt.key}
                index={i}
                emoji={opt.emoji}
                label={opt.label}
                selected={selected === opt.key}
                disabled={selected !== null}
                onSelect={() => pick(opt.key)}
              />
            ))}
          </div>

          {queue.length > 1 && (
            <BigButton compact noArrow onClick={skip} disabled={selected !== null} className="mt-3">
              Skip Question
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 2l4 4-4 4" />
                <path d="M3 11V9a3 3 0 0 1 3-3h15" />
                <path d="M7 22l-4-4 4-4" />
                <path d="M21 13v2a3 3 0 0 1-3 3H3" />
              </svg>
            </BigButton>
          )}
          <div className="mx-auto mt-1 flex flex-col items-center gap-1 text-center font-display text-sm font-medium text-[#3b4a6b]/80">
            <Wave className="text-sky-300" width={64} />
            <span>Pick the answer that&apos;s true for you!</span>
          </div>
        </div>
      )}
    </Shell>
  );
}
