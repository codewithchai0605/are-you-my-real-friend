import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";
import { POLICY_UPDATED, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The rules for using ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ProsePage title="Terms of Use" subtitle={`Last updated: ${POLICY_UPDATED}`}>
      <p>
        Welcome to {SITE_NAME}. By using this website you agree to these terms. If you do not agree, please do not use the site.
      </p>

      <h2>Using the service</h2>
      <ul>
        <li>You must be at least 13 years old to use the site.</li>
        <li>The site is provided for fun, personal, non-commercial use.</li>
        <li>Do not try to break, overload, scrape or reverse-engineer the service, or to access quiz data that is not yours.</li>
      </ul>

      <h2>Names and answers you submit</h2>
      <p>
        You are responsible for the display names and answers you enter. Do not use names that are abusive, hateful, sexual or that impersonate or harass
        another person, and do not enter personal or sensitive information about yourself or anyone else. We may remove any quiz, name or score at any time, for
        any reason, without notice.
      </p>

      <h2>The &quot;fake friend&quot; labels</h2>
      <p>
        Scores and labels such as &quot;real one&quot; or &quot;fake friend&quot; are for entertainment only. They are not a measure of anyone&apos;s character or of the
        quality of a friendship, and should never be used to bully or exclude someone.
      </p>

      <h2>Our content</h2>
      <p>
        The questions, text, design and software of the site belong to us or our licensors and are protected by copyright and other laws. You may share links to your
        quiz and your results freely, but you may not copy the site or its content for commercial use without our written permission.
      </p>

      <h2>Advertising and third-party links</h2>
      <p>
        The site may display advertisements and link to third-party websites. We do not control those sites or ads and are not responsible for them. Please
        review the <Link href="/privacy">Privacy Policy</Link> for how advertising works on this site.
      </p>

      <h2>No warranty</h2>
      <p>
        The service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind. We do not promise that it will always be available, error-free or that
        quiz data will never be lost.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE_NAME} and its operators are not liable for any indirect, incidental or consequential damages arising from your
        use of the site, including hurt feelings caused by a surprisingly low score.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date at the top shows the latest version, and continued use means you accept the changes.</p>

      <h2>Contact</h2>
      <p>
        Questions, or want to report a quiz or a name? Please use the <Link href="/contact">contact page</Link>.
      </p>
    </ProsePage>
  );
}
