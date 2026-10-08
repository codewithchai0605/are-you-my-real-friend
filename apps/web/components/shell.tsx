import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";

/**
 * The phone-shaped page frame used by every inner page (same sky-blue look as the
 * home page). Pure markup, so it works in both server and client components.
 */
export function Shell({ children, back, busy = false }: { children: ReactNode; back?: ReactNode; busy?: boolean }) {
  return (
    <main className="min-h-dvh bg-[#eaf7ff] sm:px-6 sm:py-8" aria-busy={busy || undefined}>
      <div className="relative mx-auto flex min-h-dvh w-full max-w-120 flex-col overflow-hidden bg-linear-to-b from-sky-300 via-sky-100 to-[#eaf7ff] shadow-[0_12px_50px_rgba(67,139,185,0.2)] sm:min-h-205 sm:rounded-4xl">
        {/* clouds fading into the page */}
        <Image
          src="https://res.cloudinary.com/dgxiy7wlw/image/upload/q_auto,w_340,f_webp/v1791430153/3493298hfqjgfih.png"
          alt=""
          width={780}
          height={538}
          priority
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-17.5 h-auto w-full select-none opacity-90"
          style={{ maskImage: "linear-gradient(to bottom, #000 45%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent)" }}
        />

        <header className="relative z-10 flex items-start justify-between px-4 pt-4">
          <div className="flex h-12 w-12 items-center justify-center">{back}</div>
          <Link href="/?stay=1" aria-label="Are you my real friend? – home" className="rounded-xl focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff5fa2]">
            <Image src="https://res.cloudinary.com/dgxiy7wlw/image/upload/q_auto,w_340,f_webp/v1791430153/3493298hfqjgfih.png" alt="Are you my real friend?" width={350} height={210} priority className="h-auto w-37.5 drop-shadow-[0_4px_0_rgba(67,40,35,0.12)]" />
          </Link>
          <div className="h-12 w-12" aria-hidden="true" />
        </header>

        <div className="relative z-10 flex flex-1 flex-col px-5 pb-6 pt-4">{children}</div>
        <SiteFooter />
      </div>
    </main>
  );
}

const backClasses =
  "flex size-12 items-center justify-center rounded-2xl bg-white text-[#2a8af6] shadow-[0_4px_0_#c9d6e6] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff5fa2] active:translate-y-0.5 active:shadow-none";

const chevron = (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export function BackButton({ onClick, label = "Go back" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={backClasses}>
      {chevron}
    </button>
  );
}

export function BackLink({ href, label = "Go back" }: { href: string; label?: string }) {
  return (
    <Link href={href} aria-label={label} className={backClasses}>
      {chevron}
    </Link>
  );
}
