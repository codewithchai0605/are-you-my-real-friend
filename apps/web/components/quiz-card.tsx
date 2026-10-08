import type { ReactNode } from "react";
import Image from "next/image";
import { Wave } from "./ui";
import { Bear, Panda } from "./mascots";

/** Top progress pill: pink fill + "3/10". */
export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.max(8, (current / total) * 100));
  return (
    <div
      role="progressbar"
      aria-label="Quiz progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      className="flex items-center gap-3 rounded-full bg-white p-1.5 pr-4 shadow-[0_4px_12px_rgba(60,100,150,0.12)]"
    >
      <div className="h-6 flex-1 overflow-hidden rounded-full bg-[#fdeee7]">
        <div className="h-full rounded-full bg-[#ff4f81] transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-display text-base font-bold tabular-nums text-[#17213e]">
        <span className="text-[#ff4f81]">{current}</span>/{total}
      </span>
    </div>
  );
}

/** The notebook-paper card with washi tape and the "Question 3" label. */
export function NotebookCard({
  label,
  children,
  mascot = "bear",
  animateKey,
}: {
  label: string;
  children: ReactNode;
  mascot?: "bear" | "panda";
  /** Change this to replay the entrance animation (e.g. the question key). */
  animateKey?: string;
}) {
  return (
    <section key={animateKey} className="relative mt-5 animate-pop-in">
      {/* washi tape */}
      <span aria-hidden="true" className="absolute -left-2 -top-3 z-20 h-7 w-20 rotate-[-28deg] rounded-[3px] bg-pink-300/80 shadow-sm" />
      <div className="relative z-20 mx-auto -mb-5 w-fit rotate-1 rounded-sm bg-[#ffe27a] px-7 py-1.5 font-display text-xl font-bold text-[#8a6a00] shadow-[0_3px_0_#e8c64a]">
        {label}
      </div>

      <div className="relative overflow-hidden rounded-[1.6rem] border-2 border-white bg-[#f4faff] px-9 pb-[4.9rem] pt-11 shadow-[0_10px_28px_rgba(57,107,151,0.18)]">
        {/* spiral binding holes */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-3 w-3"
          style={{
            backgroundImage: "radial-gradient(circle at center, #5ab0ff 3.6px, transparent 4.6px)",
            backgroundSize: "12px 30px",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "center 12px",
          }}
        />
        <Image src="/clouds.webp" alt="" width={780} height={538} aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-10 h-auto w-full opacity-70" />
        <div className="relative text-center font-display text-[1.65rem] font-bold leading-snug text-[#17213e]">{children}</div>
      </div>
      {/* sits on the paper's bottom edge, outside the clipped area, like the design */}
      <div className="pointer-events-none absolute -bottom-5 right-2 z-10 w-19.5">{mascot === "panda" ? <Panda /> : <Bear mood="wink" />}</div>
    </section>
  );
}

const TINTS = ["#fff0b3", "#cdeeff", "#ffd8e8", "#e4ddff"] as const;
const WAVES = ["text-yellow-300", "text-sky-400", "text-pink-400", "text-violet-400"] as const;

/** One tappable answer: emoji tile + label + coloured wave, like the picture options in the design. */
export function OptionCard({
  index,
  emoji,
  label,
  selected,
  disabled,
  onSelect,
}: {
  index: number;
  emoji: string;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      style={{ animationDelay: `${index * 70}ms` }}
      className={`group flex w-full animate-slide-up items-center gap-4 rounded-[1.7rem] border-[3px] p-3 pr-5 text-left transition duration-150 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff5fa2] disabled:cursor-not-allowed ${
        selected
          ? "translate-y-1 border-[#ff4f81] bg-[#fff0f5] shadow-[0_2px_0_#e0cdd6]"
          : "border-transparent bg-white shadow-[0_6px_0_#c9d6e6,0_14px_22px_rgba(60,100,150,0.14)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#c9d6e6] disabled:opacity-70"
      }`}
    >
      <span
        className="flex size-21 shrink-0 items-center justify-center rounded-[1.2rem] text-[2.8rem] leading-none"
        style={{ backgroundColor: TINTS[index % TINTS.length] }}
        aria-hidden="true"
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[1.4rem] font-bold leading-tight text-[#17213e]">{label}</span>
        <span className="mt-1.5 block">
          <Wave className={WAVES[index % WAVES.length]} width={88} />
        </span>
      </span>
      {selected && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ff4f81] text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      )}
    </button>
  );
}
