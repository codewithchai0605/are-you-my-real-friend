import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE_NAME} is a free, funny quiz game that shows which of your friends really know you.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ProsePage title={`About ${SITE_NAME}`} subtitle="A funny little quiz about friendship">
      <h2>What it is</h2>
      <p>
        {SITE_NAME} is a free quiz game for friends. You answer ten light-hearted questions about yourself, such as your favourite sweet, your midnight
        snack or your usual excuse for being late. Then you share a link. Each friend answers the same questions about you, and we show you who knows you
        best and who was just guessing.
      </p>

      <h2>How it works</h2>
      <ul>
        <li>You pick your name and answer ten questions, choosing from four options each.</li>
        <li>Every friend gets the same ten questions in their own random order.</li>
        <li>For each question a friend sees only two options: your real answer and one random decoy.</li>
        <li>Friends see their score straight away, and you get a leaderboard of everyone who played.</li>
      </ul>

      <h2>Why we made it</h2>
      <p>
        Group chats are full of jokes but light on surprises. We wanted a small, silly game that makes people laugh, start conversations and notice the little
        details that make each friend unique, without asking anyone to create an account or hand over personal information.
      </p>

      <h2>Privacy first</h2>
      <p>
        There are no accounts and no passwords. We store only the display names and answers that quiz-takers type in, plus an anonymous random ID in your
        browser so we can recognise you when you come back. Read the details in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>How the site is funded</h2>
      <p>
        {SITE_NAME} is free to use. To cover hosting costs we may show advertising. We never sell your quiz answers, and ads never change who sees your
        results.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, ideas or something that looks broken? Visit our <Link href="/contact">contact page</Link>. We read every message. You may also enjoy our{" "}
        <Link href="/guides">guides</Link> on writing funny quizzes and starting better conversations with friends.
      </p>
    </ProsePage>
  );
}
