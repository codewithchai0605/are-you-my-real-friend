import Link from "next/link";
import { COPYRIGHT_YEAR, SITE_NAME } from "@/lib/site";

const LINKS = [
  ["About", "/about"],
  ["Guides", "/guides"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Contact", "/contact"],
] as const;

/** Sitewide footer: clear navigation + policy links (AdSense reviewers look for these). */
export function SiteFooter() {
  return (
    <footer className="relative z-10 px-5 pb-8 pt-4 text-center">
      <nav aria-label="Site links">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-display text-base font-semibold text-[#3b4a6b]">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="rounded underline-offset-4 hover:text-blue-1000 hover:underline focus-visible:outline-4 focus-visible:outline-[#ff5fa2]">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-3 font-display text-sm text-[#3b4a6b]/70">
        © {COPYRIGHT_YEAR} {SITE_NAME}. A fun quiz for friends who (mostly) pay attention.
      </p>
    </footer>
  );
}
