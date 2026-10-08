import Image from 'next/image'
import Link from 'next/link'
import { HomeContent } from '@/components/home-content'
import { MyQuizzes } from '@/components/my-quizzes'
import { SiteFooter } from '@/components/site-footer'

const DOODLES = [
  { left: '5%', top: '15%', rotate: -15, size: 60, path: '/doodle-white-1.svg', delay: 0 },
  { left: '85%', top: '10%', rotate: 20, size: 50, path: '/doodle-white-2.svg', delay: 0.5 },
  { left: '10%', top: '65%', rotate: 10, size: 45, path: '/doodle-white-3.svg', delay: 1 },
  { left: '82%', top: '70%', rotate: -25, size: 55, path: '/doodle-white-4.svg', delay: 1.5 },
  { left: '50%', top: '5%', rotate: 5, size: 40, path: '/doodle-white-5.svg', delay: 2 },
  { left: '75%', top: '45%', rotate: -10, size: 48, path: '/doodle-white-6.svg', delay: 2.5 },
]

const Page = () => {
  return (
    <main className="min-h-screen bg-[#eaf7ff] sm:px-6 sm:py-8">
      <div className="relative mx-auto min-h-screen w-full max-w-120 overflow-hidden bg-linear-to-b from-sky-300 via-sky-100 to-white shadow-[0_12px_50px_rgba(67,139,185,0.2)] sm:min-h-205 sm:rounded-4xl">

      {/* ============ FLOATING DOODLES ============ */}
      <div className="absolute inset-0 pointer-events-none">
        {DOODLES.map((doodle, index) => (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              left: doodle.left,
              top: doodle.top,
              transform: `rotate(${doodle.rotate}deg)`,
              animationDelay: `${doodle.delay}s`,
            }}
          >
            <Image
              src={doodle.path}
              alt=""
              width={doodle.size}
              height={doodle.size}
              className="opacity-60"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* ============ MAIN CONTAINER ============ */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pb-8 pt-8 sm:min-h-100">

        {/* Logo */}
        <div className="mb-2">
          <Image
            src="https://res.cloudinary.com/dgxiy7wlw/image/upload/q_auto,w_340,f_webp/v1791430153/3493298hfqjgfih.png"
            alt="Are you my real friend? logo"
            width={340}
            height={213}
            className="h-auto w-[min(82vw,340px)] drop-shadow-[0_5px_0_rgba(67,40,35,0.12)]"
            priority
          />
        </div>

        {/* Tagline */}
        <div className="mb-3 mt-5 flex h-16.5 w-54 -rotate-2 items-center justify-center bg-[url('/strip.svg')] bg-size-[100%_100%] bg-center bg-no-repeat">
          <p className="-mt-1 text-center text-base font-extrabold tracking-tight text-[#26344e]">Find your Fake Friends</p>
        </div>

        {/* Clouds - Moved here below tagline */}
        <div className="-mt-25 mb-1 w-[calc(100%+2.5rem)] max-w-none">
          <Image
            src="/clouds.webp"
            alt=""
            width={800}
            height={150}
            className="h-auto w-full opacity-90"
            aria-hidden="true"
          />
        </div>

        {/* Character Illustration Card */}
        <div className="relative mb-5 w-full max-w-sm rounded-4xl border-10 border-white bg-white p-4 shadow-[0_12px_28px_rgba(57,107,151,0.17)]">
          <Image src="/doodle-10.svg" alt="" width={40} height={40} className="pointer-events-none absolute -left-8 top-8 z-20 -rotate-12 opacity-90" aria-hidden="true" />
          <Image src="/doodle-11.svg" alt="" width={35} height={35} className="pointer-events-none absolute -right-8 top-24 z-20 rotate-12 opacity-90" aria-hidden="true" />
          <Image src="/doodle-16.svg" alt="" width={38} height={38} className="pointer-events-none absolute -left-7 top-1/2 z-20 rotate-6 opacity-90" aria-hidden="true" />
          <Image src="/note-card.svg" alt="" width={45} height={45} className="pointer-events-none absolute -right-8 top-1/2 z-20 -rotate-12 opacity-90" aria-hidden="true" />
          <Image src="/doodle-10.svg" alt="" width={32} height={32} className="pointer-events-none absolute -bottom-5 left-3 z-20 rotate-12 opacity-80" aria-hidden="true" />
          <Image src="/doodle-11.svg" alt="" width={36} height={36} className="pointer-events-none absolute -bottom-6 right-3 z-20 -rotate-12 opacity-80" aria-hidden="true" />
          <div className="relative mb-4">
            <Image
              src="/card.webp"
              alt="Two friends using phones"
              width={280}
              height={200}
              className="rounded-[1.15rem]"
            />
            {/* Floating heart using image */}
            <div className="absolute -right-4 -top-4 rotate-12">
              <Image
                src="/note-card.svg"
                alt=""
                width={48}
                height={48}
                className="drop-shadow-lg"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2 px-1 text-center">
            <p className="text-[clamp(1.45rem,6.5vw,2rem)] font-black tracking-tight text-[#17213e]">
              create your quiz
            </p>
            <p className="text-2xl font-black leading-none text-pink-500">&amp;</p>
            <p className="text-[clamp(1.35rem,6vw,1.85rem)] font-black tracking-tight text-[#17213e]">
              <span className="mr-1 inline-block -rotate-1 bg-[#ffd943] px-1.5 shadow-[0_3px_0_#edbd27]">block</span> your fake friends
            </p>
          </div>

          {/* Decorative wavy line */}
          <div className="mt-3 flex justify-center">
            <svg width="200" height="20" viewBox="0 0 200 20" className="text-pink-300">
              <path
                d="M0 10 Q 25 20, 50 10 T 100 10 T 150 10 T 200 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/create" className="group flex w-full max-w-sm items-center justify-center gap-3 rounded-[1.3rem] border-4 border-[#c7edff] bg-linear-to-r from-[#23b4ff] to-[#078af4] px-6 py-4 text-xl font-extrabold text-white shadow-[0_5px_0_#0574d2,0_10px_16px_rgba(16,120,205,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:shadow-[0_3px_0_#0574d2]">
          <span>create quiz</span>
          <Image
            src="/note-card.svg"
            alt=""
            width={28}
            height={28}
            className="group-hover:translate-x-1 transition-transform brightness-0 invert"
            aria-hidden="true"
          />
        </Link>

        {/* Quizzes this browser created (reads localStorage after load) */}
        <MyQuizzes />
      </div>

      {/* ============ HOW TO PLAY SECTION ============ */}
      <section className="relative bg-[#f4f6f8] px-4 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto max-w-190">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="text-[clamp(2.6rem,7vw,5rem)] font-black leading-[0.9] tracking-[-0.08em] text-[#17213e]">
              how to play?
            </h2>
            <p className="mt-2 text-[clamp(1.1rem,2.4vw,2rem)] font-extrabold leading-tight tracking-tighter text-[#f15ea6]">
              find your fake friends &amp; decide who to block
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#f15ea6] text-[0.7rem] font-black text-[#f15ea6] align-middle">
                ×
              </span>
            </p>
          </div>

          <div className="space-y-0 rounded-3xl bg-[#f4f6f8]">
            <HowToPlayItem
              icon="✏️"
              title="CREATE YOUR QUIZ"
              description="Answer 10 quick questions about yourself that reveal how well others know you."
            />
            <HowToPlayItem
              icon="📲"
              title="SHARE WITH FRIENDS"
              description="Challenge friends to prove they're not faking it! Send via WhatsApp, Instagram, or Snapchat."
            />
            <HowToPlayItem
              icon="🏆"
              title="FIND FAKE FRIENDS"
              description="Check their scores, and block all friends who have low scores."
            />
          </div>
        </div>
      </section>

      {/* ============ ABOUT + FAQ + GUIDES (real text for visitors and reviewers) ============ */}
      <HomeContent />
      <div className="bg-white">
        <SiteFooter />
      </div>
      </div>
    </main>
  )
}

function HowToPlayItem({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 border-t border-[#d7dfe7] py-6 first:border-t-0 sm:gap-5 sm:py-7">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] border border-[#f6dfe8] bg-[#f9e0e7] text-3xl shadow-[0_5px_0_rgba(234,146,176,0.35)] sm:h-18 sm:w-18">
        <span aria-hidden="true">{icon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[clamp(1.8rem,3vw,2.7rem)] font-black leading-[0.95] tracking-[-0.06em] text-[#17213e]">
          {title}
        </h3>
        <p className="mt-2 max-w-136 text-[clamp(1.1rem,2vw,1.7rem)] font-medium leading-[1.2] tracking-[-0.03em] text-[#24304a]">
          {description}
        </p>
      </div>
    </div>
  )
}

export default Page
