import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProsePage } from "@/components/prose-page";
import { BigLink } from "@/components/ui";
import { GUIDES, getGuide } from "@/lib/guides";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.title, description: guide.description, publishedTime: guide.date },
  };
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  return (
    <ProsePage title={guide.title} backHref="/guides">
      <p className="!mt-0 text-[1.1rem] font-medium">{guide.intro}</p>
      {guide.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <div className="mt-8">
        <BigLink href="/create">make your own quiz</BigLink>
      </div>
    </ProsePage>
  );
}
