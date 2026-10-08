import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description: "Tips and ideas for fun friend quizzes, better conversations and happier friendships.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <ProsePage title="Guides" subtitle="Ideas for friend quizzes and friendly chats">
      <ul className="!mt-0 !list-none !space-y-5 !pl-0">
        {GUIDES.map((guide) => (
          <li key={guide.slug} className="!pl-0">
            <h2 className="!mt-0 !text-[1.3rem]">
              <Link href={`/guides/${guide.slug}`} className="!text-[#17213e] !no-underline hover:!text-[#2a8af6]">
                {guide.title}
              </Link>
            </h2>
            <p className="!mt-1">{guide.description}</p>
            <Link href={`/guides/${guide.slug}`}>Read the guide →</Link>
          </li>
        ))}
      </ul>
    </ProsePage>
  );
}
