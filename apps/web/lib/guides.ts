export type GuideSection = { heading: string; paragraphs?: string[]; list?: string[] };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  intro: string;
  sections: GuideSection[];
};

export const GUIDES: readonly Guide[] = [
  {
    slug: "fun-questions-to-ask-friends",
    title: "25 Fun Questions to Ask Your Friends",
    description: "A big list of light, funny questions that start real conversations, plus how to turn them into a quiz your friends can take.",
    date: "2026-10-08",
    intro:
      "Good questions are a small superpower. The right one turns a quiet group chat into an hour of laughing, arguing and oversharing. Here are 25 that work, sorted by the kind of conversation they start.",
    sections: [
      {
        heading: "Food and habits",
        paragraphs: ["Everyone has strong opinions about food, which makes it the safest place to start. There is rarely a wrong answer, only a dramatic one."],
        list: [
          "What is the one snack you would defend in court?",
          "Tea, coffee or a cold drink, and how many times a day?",
          "What do you eat at midnight when nobody is watching?",
          "Which sweet can you never say no to?",
          "What is your signature dish, the one you are secretly proud of?",
          "Which food do you pretend to like but secretly do not?",
        ],
      },
      {
        heading: "Daily life and quirks",
        paragraphs: ["Small habits are where personality hides. They are also the details a true friend notices without trying."],
        list: [
          "How many times do you snooze your alarm?",
          "Which app do you open without thinking, and what does your screen time say?",
          "What is your usual excuse when you are running late?",
          "What tiny thing drives you completely insane?",
          "Do you reply instantly, or let messages marinate for three days?",
          "What is the very first thing you do after waking up?",
        ],
      },
      {
        heading: "Dreams and what-ifs",
        list: [
          "Which superpower would you pick, and what would you do with it first?",
          "Beach, mountains, big city or jungle: where would you go tomorrow?",
          "Which pet would you adopt if money and space were no problem?",
          "Which movie genre could you watch on repeat?",
          "What would you do with a free day and no phone?",
          "If your life had a theme song, what would it be?",
        ],
      },
      {
        heading: "The friend group",
        paragraphs: ["These are the questions that turn into inside jokes. Ask them when everyone is together and nobody is in a hurry."],
        list: [
          "What role do you play in the group: the joker, the planner, the foodie or the sleepyhead?",
          "Who would survive longest in a zombie movie?",
          "What is the funniest thing that ever happened to us?",
          "What is something small I did that you still remember?",
          "Who always replies last?",
          "What would you never let me forget?",
          "What is one tradition we should start?",
        ],
      },
      {
        heading: "From questions to a quiz",
        paragraphs: [
          "Asking is fun, but guessing is funnier. When your friends have to pick your real answer out of a few choices, you quickly find out who has been paying attention. That is the idea behind Are you my real friend?: you answer ten questions about yourself, share the link, and see how many your friends get right.",
        ],
      },
    ],
  },
  {
    slug: "how-to-make-a-funny-friend-quiz",
    title: "How to Write a Friend Quiz That Is Actually Funny",
    description: "Six simple habits behind the friend quizzes that get shared, screenshotted and argued about.",
    date: "2026-10-08",
    intro:
      "A friend quiz lives or dies on its questions. These are the habits behind the ones people actually finish, share and argue about, whether you are writing your own or choosing from a ready-made list.",
    sections: [
      {
        heading: "Be specific, not general",
        paragraphs: [
          "'What is your favourite food?' invites a shrug. 'Which midnight snack would you attack?' invites a story. Specific questions are easier to answer and easier to get wrong, which is exactly what makes a quiz fun.",
        ],
      },
      {
        heading: "Make the wrong answers believable",
        paragraphs: [
          "If three options are silly and one is obvious, nobody learns anything. Good wrong answers are things you could imagine yourself choosing on a different day. When two choices both feel right, a friend has to actually remember something about you.",
          "In Are you my real friend? every friend sees only two options: your real answer and one random decoy. That keeps every question a fair fight between a guess and a real memory.",
        ],
      },
      {
        heading: "Mix easy and hard",
        paragraphs: [
          "Start with a few questions anyone close to you should get right, then slip in two or three that only a true friend would know. The easy ones make people feel clever. The hard ones create the drama.",
        ],
      },
      {
        heading: "Keep it short",
        paragraphs: ["Ten questions take about two minutes. That is long enough to feel like a challenge and short enough that people finish it and send it on."],
      },
      {
        heading: "Answer honestly",
        paragraphs: [
          "It is tempting to pick the answer that sounds cooler. Resist it. A quiz about an imaginary version of you only proves how well your friends know the imaginary version.",
        ],
      },
      {
        heading: "Share it where your friends already are",
        paragraphs: [
          "Drop the link in the group chat or a story and add a small dare, like 'bet you cannot get 8 out of 10'. A playful challenge gets far more answers than a bare link.",
        ],
      },
    ],
  },
  {
    slug: "fake-friend-or-just-forgetful",
    title: "Fake Friend or Just Forgetful? What a Quiz Score Really Means",
    description: "A low score on a friend quiz stings for five seconds. Here is what it actually says about a friendship, which is less than you think.",
    date: "2026-10-08",
    intro:
      "A low score on a friend quiz stings for about five seconds and then turns into a joke. But what does it say about the friendship? Much less than the dramatic 'fake friend' label suggests.",
    sections: [
      {
        heading: "Remembering is not the same as caring",
        paragraphs: [
          "Remembering details is partly a skill and partly a habit of attention. Some people are wonderful with feelings and hopeless with facts. A friend who forgets your favourite sweet may still be the first person to show up when something goes wrong.",
        ],
      },
      {
        heading: "Time together beats time online",
        paragraphs: [
          "Details like how you spend a free day, or what really scares you, come out in person far more than in a chat. If a friend scores low, the fix is usually more time together, not a block button.",
        ],
      },
      {
        heading: "How to read a score out of 10",
        paragraphs: [
          "Because every question offers only two options, pure guessing lands around 5 out of 10. So a 4, 5 or 6 simply means 'about the same as guessing'. Here is a friendly way to read the rest:",
        ],
        list: [
          "9 to 10: a close friend who really pays attention.",
          "7 to 8: a good friend, and a few gaps are completely normal.",
          "4 to 6: close to a coin flip. Plenty of room to get to know each other better.",
          "0 to 3: either very unlucky or a very new friend. Time for a long chat over snacks.",
        ],
      },
      {
        heading: "Use it as a conversation starter",
        paragraphs: [
          "Ask your friend which question surprised them. Tell the story behind one of your answers. The quiz is not the point; it is a doorway to the stories behind the answers.",
        ],
      },
      {
        heading: "Please do not actually block people over a quiz",
        paragraphs: [
          "The 'fake friend' badge is a joke. If a score makes you stop and think about a friendship, talk to the person instead. That conversation is worth far more than the number.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
