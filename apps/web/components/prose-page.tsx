import type { ReactNode } from "react";
import { BackLink, Shell } from "./shell";

/** Readable long-form page inside the same sky-blue frame (About, Privacy, Terms, guides…). */
export function ProsePage({
  title,
  subtitle,
  backHref = "/?stay=1",
  children,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: ReactNode;
}) {
  return (
    <Shell back={<BackLink href={backHref} label="Go back" />}>
      <article className="flex flex-1 flex-col gap-4 pt-2">
        <header className="text-center">
          <h1 className="font-display text-[2rem] font-bold leading-tight text-[#17213e]">{title}</h1>
          {subtitle && <p className="mt-1 font-display text-base font-medium text-[#3b4a6b]">{subtitle}</p>}
        </header>
        <div
          className={[
            "rounded-4xl border-[6px] border-white bg-white p-6 text-[1.02rem] leading-relaxed text-[#24304a] shadow-[0_12px_28px_rgba(57,107,151,0.15)]",
            "[&_h2]:mt-7 [&_h2]:font-display [&_h2]:text-[1.45rem] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-[#17213e] [&_h2:first-child]:mt-0",
            "[&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:pl-1",
            "[&_a]:font-semibold [&_a]:text-blue-1000 [&_a]:underline [&_a]:underline-offset-2",
          ].join(" ")}
        >
          {children}
        </div>
      </article>
    </Shell>
  );
}
