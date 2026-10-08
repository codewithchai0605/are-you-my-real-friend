import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE_NAME } from "@/lib/site";

const FAQ = [
  {
    q: `What is ${SITE_NAME}?`,
    a: "A free, funny quiz game for friends. You answer ten questions about yourself, share the link, and see which friends really know you and which ones were only guessing.",
  },
  {
    q: "Do my friends need an account?",
    a: "No. Nobody needs an account or a password. Friends open your link, type a name and start answering straight away.",
  },
  {
    q: "How are the questions chosen for my friends?",
    a: "Every friend gets the same ten questions you answered, but in their own random order. For each question they see only two options: your real answer and one random decoy.",
  },
  {
    q: "Can I see who answered my quiz?",
    a: "Yes. Open your quiz in the same browser you created it in and you will see a leaderboard with every friend's score. Because there are no accounts, your results are tied to that browser.",
  },
  {
    q: "What happens to my data?",
    a: "We store the display names and answers that quiz-takers type in, plus an anonymous random ID in your browser. We never sell your answers. Read the full details in our Privacy Policy.",
  },
  {
    q: "How do I delete my quiz?",
    a: "Contact us with your quiz link and we will remove the quiz and every answer connected to it.",
  },
] as const;

/** Text-rich section under the "how to play" block: explains the product, answers FAQs, links to guides. */
export function HomeContent() {
  return (
    <section aria-labelledby="about-heading" className="bg-white px-5 py-10">
      <div className="mx-auto max-w-190 text-[#24304a]">
        <h2 id="about-heading" className="text-[1.7rem] font-black leading-tight tracking-tight text-[#17213e]">
          What is {SITE_NAME}?
        </h2>
        <p className="mt-3 text-[1.05rem] leading-relaxed">
          {SITE_NAME} is a quick, silly quiz about friendship. You pick your name and answer ten light-hearted questions about yourself, like your favourite sweet,
          your midnight snack or your usual excuse for being late. Then you share one link. Each friend answers the same questions about you, and you find out who
          knows you best, and who has been bluffing all along.
        </p>
        <p className="mt-3 text-[1.05rem] leading-relaxed">
          It takes about two minutes, works on any phone, and needs no sign-up. Read more <Link href="/about" className="font-semibold text-[#2a8af6] underline underline-offset-2">about the game</Link>.
        </p>

        <h2 className="mt-9 text-[1.7rem] font-black leading-tight tracking-tight text-[#17213e]">Frequently asked questions</h2>
        <div className="mt-3 divide-y divide-[#e3e9f0] rounded-2xl border border-[#e3e9f0]">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[1.05rem] font-bold text-[#17213e] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="text-xl text-blue-1000 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <h2 className="mt-9 text-[1.7rem] font-black leading-tight tracking-tight text-[#17213e]">From our guides</h2>
        <ul className="mt-3 space-y-3">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`} className="block rounded-2xl bg-[#f4f6f8] px-4 py-3 transition hover:bg-[#e8f3ff]">
                <span className="block font-bold text-[#17213e]">{guide.title}</span>
                <span className="mt-0.5 block text-[0.95rem] text-[#3b4a6b]">{guide.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
