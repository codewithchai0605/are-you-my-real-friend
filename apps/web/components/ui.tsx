import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/* ─────────────────────────────── icons ─────────────────────────────── */

export function Spinner({ className = "size-6" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3.5" />
      <path d="M21.5 12A9.5 9.5 0 0 0 12 2.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowCircle({ className = "size-8" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white text-[#078af4] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="size-[62%]" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export function Star({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5l-6 3.4 1.3-6.7-5-4.7 6.8-.8L12 2.5z"
        fill="#ffd943"
        stroke="#e9a900"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wave({ className = "text-yellow-300", width = 96 }: { className?: string; width?: number }) {
  return (
    <svg width={width} height="10" viewBox="0 0 96 10" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M2 5 Q 8 -1 14 5 T 26 5 T 38 5 T 50 5 T 62 5 T 74 5 T 86 5 T 94 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────────── buttons ─────────────────────────────── */

const bigButton =
  "group relative flex items-center justify-center gap-3 rounded-[1.3rem] border-4 border-[#c7edff] bg-linear-to-r from-[#23b4ff] to-[#078af4] px-6 py-3.5 font-display text-2xl font-bold tracking-tight text-white shadow-[0_5px_0_#0574d2,0_12px_18px_rgba(16,120,205,0.28)] transition duration-150 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff5fa2] active:translate-y-1 active:shadow-[0_1px_0_#0574d2,0_4px_8px_rgba(16,120,205,0.25)] disabled:pointer-events-none disabled:opacity-70";

type BigButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Shows a spinner and blocks clicks while a Server Action is running. */
  pending?: boolean;
  /** Hide the little round arrow. */
  noArrow?: boolean;
  /** Pending label, e.g. "Starting…". */
  pendingLabel?: string;
  /** Shrink-to-fit and centred instead of full width (e.g. "Skip question"). */
  compact?: boolean;
};

export function BigButton({ pending = false, noArrow = false, compact = false, pendingLabel, children, className = "", disabled, ...rest }: BigButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={`${bigButton} ${compact ? "mx-auto px-9 py-3 text-xl" : "w-full"} ${className}`}
    >
      {pending ? (
        <>
          <Spinner className="size-7" />
          <span>{pendingLabel ?? children}</span>
        </>
      ) : (
        <>
          <span className="inline-flex items-center gap-2.5 whitespace-nowrap">{children}</span>
          {!noArrow && <ArrowCircle className="size-9 transition-transform group-hover:translate-x-1" />}
        </>
      )}
    </button>
  );
}

export function BigLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`${bigButton} w-full ${className}`}>
      <span>{children}</span>
      <ArrowCircle className="size-9 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

/** Smaller chunky white button (copy, share, refresh…). */
export const softButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white bg-white px-4 py-3 font-display text-lg font-semibold text-[#17213e] shadow-[0_4px_0_#c9d6e6] transition duration-150 hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff5fa2] active:translate-y-0.5 active:shadow-[0_1px_0_#c9d6e6] disabled:pointer-events-none disabled:opacity-60";

/* ─────────────────────────────── bubbles & fields ─────────────────────────────── */

export function SpeechBubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative -rotate-3 rounded-4xl border-[3px] border-pink-200 bg-[#ffe3ee] px-6 py-5 shadow-[0_8px_18px_rgba(240,98,146,0.15)] ${className}`}>
      {children}
      <span className="absolute -bottom-3 right-10 size-6 rotate-45 border-r-[3px] border-b-[3px] border-pink-200 bg-[#ffe3ee]" aria-hidden="true" />
    </div>
  );
}

type NameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  max: number;
  label: string;
  invalid?: boolean;
  autoFocus?: boolean;
  id: string;
};

export function NameField({ value, onChange, placeholder, max, label, invalid, autoFocus, id }: NameFieldProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full border-[3px] bg-[#fffdf8] px-4 py-3 shadow-[0_6px_16px_rgba(42,138,246,0.18)] transition focus-within:ring-4 focus-within:ring-blue-1000/25 ${
        invalid ? "animate-shake border-red-400" : "border-blue-1000"
      }`}
    >
      <Star className="size-8 shrink-0 -rotate-12" />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="text"
        autoComplete="given-name"
        autoCapitalize="words"
        autoFocus={autoFocus}
        maxLength={max}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className="min-w-0 flex-1 bg-transparent font-display text-xl font-semibold text-[#17213e] outline-none placeholder:text-[#a5afc9]"
      />
      <span className="shrink-0 font-display text-base font-semibold tabular-nums text-[#17213e]/70" aria-hidden="true">
        {[...value].length}/{max}
      </span>
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="animate-pop-in rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-2.5 text-center font-display text-base font-medium text-red-700">
      {children}
    </p>
  );
}
