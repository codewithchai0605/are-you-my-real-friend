import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ProsePage title="Contact us" subtitle="We read every message">
      <h2>Email</h2>
      {CONTACT_EMAIL ? (
        <p>
          Write to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We usually reply within a few days.
        </p>
      ) : (
        <p>
          <strong>Site owner:</strong> set <code>NEXT_PUBLIC_CONTACT_EMAIL</code> to a real, monitored address and rebuild. Google expects a working contact
          method before approving a site.
        </p>
      )}

      <h2>What you can contact us about</h2>
      <ul>
        <li>Deleting a quiz and its answers (include the quiz link).</li>
        <li>Reporting an inappropriate name or quiz (include the link).</li>
        <li>Bugs, ideas and questions about how the quiz works.</li>
        <li>Privacy questions. See also our <Link href="/privacy">Privacy Policy</Link>.</li>
      </ul>

      <h2>Before you write</h2>
      <p>
        If you are the owner of a quiz and cannot see your results, open the site in the same browser you used to create the quiz. Results are tied to that
        browser, since there are no accounts.
      </p>
    </ProsePage>
  );
}
