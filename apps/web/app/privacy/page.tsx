import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";
import { CONTACT_EMAIL, POLICY_UPDATED, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your information, cookies and advertising.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy Policy" subtitle={`Last updated: ${POLICY_UPDATED}`}>
      <p>
        This policy explains what {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) collects when you use this website, why we collect it, and the choices you have. By using
        the site you agree to this policy.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Quiz content you type in:</strong> the display name you choose (up to 15 characters), your gender choice (used only to word the questions),
          the answers you select, and, if you take someone else&apos;s quiz, your display name and answers.
        </li>
        <li>
          <strong>An anonymous browser ID:</strong> a random identifier generated in your browser and kept in its local storage. It lets us recognise a quiz
          owner who comes back, and stops the same browser answering one quiz twice. It contains no personal information and is not linked to your identity.
        </li>
        <li>
          <strong>Technical data:</strong> like most websites, our servers and hosting provider may log your IP address, browser type and the pages requested,
          for security and to keep the service running.
        </li>
      </ul>
      <p>We do not ask for your email address, phone number, password or real name, and you do not need an account.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To run the quiz: generate share links, show friends the questions, calculate scores and show the owner a leaderboard.</li>
        <li>To keep the site secure and prevent abuse.</li>
        <li>To understand, in aggregate, how the site is used so we can improve it.</li>
      </ul>

      <h2>Who can see what</h2>
      <p>
        A quiz owner&apos;s display name is shown to anyone who has the quiz link. A friend&apos;s display name and score are shown to the owner of the quiz they
        answered. Please do not enter names or details you would not want those people to see.
      </p>

      <h2>Advertising and cookies</h2>
      <p>
        We may use Google AdSense to show ads. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this
        website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or
        other sites on the Internet.
      </p>
      <ul>
        <li>
          You may opt out of personalised advertising by visiting{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          . You can also opt out of some third-party vendors&apos; use of cookies for personalised advertising at{" "}
          <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          .
        </li>
        <li>
          To learn how Google uses information from sites that use its services, see{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            How Google uses information from sites or apps that use our services
          </a>
          .
        </li>
        <li>
          If you visit from the European Economic Area, the United Kingdom or Switzerland, you will be asked for your consent to cookies and personalised
          advertising, and you can change your choice at any time.
        </li>
      </ul>
      <p>
        Apart from the local-storage ID described above, we do not set our own advertising or tracking cookies. You can clear local storage and cookies at any
        time in your browser settings; doing so will make you look like a new visitor.
      </p>

      <h2>Sharing and retention</h2>
      <p>
        We do not sell your personal information. We share data only with service providers that host and run the site (such as our hosting and database
        providers) and with advertising partners as described above, or when the law requires it. We keep quiz data for as long as the quiz is active, and we
        will delete it on request.
      </p>

      <h2>Children</h2>
      <p>
        {SITE_NAME} is intended for people aged 13 and over. We do not knowingly collect information from children under 13. If you believe a child has
        given us personal information, please contact us and we will remove it.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask us to delete a quiz and its answers, or to tell you what we hold about a name or quiz link, by contacting us
        {CONTACT_EMAIL ? (
          <>
            {" "}
            at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </>
        ) : null}{" "}
        or via the <Link href="/contact">contact page</Link>. Depending on where you live, you may have additional rights over your data under local law.
      </p>

      <h2>Changes to this policy</h2>
      <p>If we change this policy, we will update the date at the top of this page. Continued use of the site means you accept the updated policy.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Please reach us through the <Link href="/contact">contact page</Link>.
      </p>
    </ProsePage>
  );
}
