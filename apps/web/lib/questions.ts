/**
 * The question bank. Everything the quiz needs to *display* lives here.
 * The database only stores keys (question key + option key), so you can
 * reword or re-emoji anything below without a migration.
 *
 * NEVER delete or rename a `key` once real quizzes exist – old quizzes point at it.
 *
 *  - `ask`   → first person, shown to the quiz owner while they build the quiz
 *  - `about` → third person, shown to friends. Tokens: {name} {he} {his} {him}
 */
export const OPTION_KEYS = ["a", "b", "c", "d"] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

export type QuestionOption = { key: OptionKey; label: string; emoji: string };

export type Question = {
  key: string;
  ask: string;
  about: string;
  options: readonly [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
};

const o = (key: OptionKey, label: string, emoji: string): QuestionOption => ({ key, label, emoji });

export const QUESTIONS: readonly Question[] = [
  {
    key: "sweet",
    ask: "Which sweet treat can I never beat?",
    about: "Which sweet treat can {name} never beat?",
    options: [o("a", "Gulab jamun", "🍯"), o("b", "Chocolate", "🍫"), o("c", "Ice cream", "🍦"), o("d", "Jalebi", "🌀")],
  },
  {
    key: "money",
    ask: "What do I spend most of my money on?",
    about: "What does {name} spend most of {his} money on?",
    options: [o("a", "Snacks & food", "🍔"), o("b", "Clothes & shoes", "👟"), o("c", "Games & gadgets", "🎮"), o("d", "Going out with friends", "👯")],
  },
  {
    key: "free-day",
    ask: "On a free day, how do I like to play?",
    about: "On a free day, how does {name} like to play?",
    options: [o("a", "Sleeping till noon", "😴"), o("b", "Movie marathon", "🍿"), o("c", "Out with the gang", "🛵"), o("d", "Scrolling the phone", "📱")],
  },
  {
    key: "superpower",
    ask: "Which superpower would I choose to use?",
    about: "Which superpower would {name} choose to use?",
    options: [o("a", "Invisibility", "🕶️"), o("b", "Flying", "🦸"), o("c", "Mind reading", "🔮"), o("d", "Time travel", "⏳")],
  },
  {
    key: "midnight-snack",
    ask: "Which midnight snack would I attack?",
    about: "Which midnight snack would {name} attack?",
    options: [o("a", "Maggi", "🍜"), o("b", "Chips", "🥔"), o("c", "Biscuits", "🍪"), o("d", "Cold pizza", "🍕")],
  },
  {
    key: "app",
    ask: "Which app am I glued to, all day through?",
    about: "Which app is {name} glued to, all day through?",
    options: [o("a", "Instagram", "📸"), o("b", "WhatsApp", "💬"), o("c", "YouTube", "▶️"), o("d", "Snapchat", "👻")],
  },
  {
    key: "fear",
    ask: "What makes me shake and quake?",
    about: "What makes {name} shake and quake?",
    options: [o("a", "Cockroaches", "🪳"), o("b", "Exam results", "📝"), o("c", "Dark rooms", "🌑"), o("d", "Phone at 1%", "🔋")],
  },
  {
    key: "late-excuse",
    ask: "When I'm late, what's my excuse on the plate?",
    about: "When {name} is late, what's the excuse on the plate?",
    options: [o("a", "Traffic was crazy", "🚦"), o("b", "Network issue", "📶"), o("c", "Just woke up", "😪"), o("d", "Reaching in 5 minutes", "🏃")],
  },
  {
    key: "dream-trip",
    ask: "Where would I love to roam, far from home?",
    about: "Where would {name} love to roam, far from home?",
    options: [o("a", "A sunny beach", "🏖️"), o("b", "Snowy mountains", "⛰️"), o("c", "A big, shiny city", "🌆"), o("d", "Jungle safari", "🐯")],
  },
  {
    key: "drink",
    ask: "What's in my cup, drained right up?",
    about: "What's in {name}'s cup, drained right up?",
    options: [o("a", "Chai", "☕"), o("b", "Cold coffee", "🧋"), o("c", "Cold drink", "🥤"), o("d", "Fresh juice", "🧃")],
  },
  {
    key: "movie",
    ask: "Movie night pick — which genre would I click?",
    about: "Movie night pick — which genre would {name} click?",
    options: [o("a", "Comedy", "😂"), o("b", "Horror", "🧟"), o("c", "Romance", "💕"), o("d", "Action", "💥")],
  },
  {
    key: "pet-peeve",
    ask: "What drives me insane, again and again?",
    about: "What drives {name} insane, again and again?",
    options: [o("a", "Slow Wi-Fi", "🐌"), o("b", "Loud chewing", "😖"), o("c", "Being left on seen", "👀"), o("d", "Cancelled plans", "❌")],
  },
  {
    key: "pet",
    ask: "Which pet would I adopt and love a lot?",
    about: "Which pet would {name} adopt and love a lot?",
    options: [o("a", "Dog", "🐶"), o("b", "Cat", "🐱"), o("c", "Parrot", "🦜"), o("d", "Dragon", "🐉")],
  },
  {
    key: "morning",
    ask: "At sunrise, how do I rise?",
    about: "At sunrise, how does {name} rise?",
    options: [o("a", "Snoozing ten times", "⏰"), o("b", "Bright and early", "🌅"), o("c", "Phone first, face later", "🤳"), o("d", "Straight to breakfast", "🥞")],
  },
  {
    key: "group-role",
    ask: "In our friend group, what's my role?",
    about: "In the friend group, what's {name}'s role?",
    options: [o("a", "The joker", "🤡"), o("b", "The planner", "🗺️"), o("c", "The foodie", "🍕"), o("d", "The sleepyhead", "💤")],
  },
  {
    key: "sleep-pose",
    ask: "In which posture do I sleep at night?",
    about: "In which posture does {name} sleep at night?",
    options: [
      o("a", "The Crime Scene (spread eagle)", "🤸"),
      o("b", "The Burrito (wrapped in blanket)", "🌯"),
      o("c", "The Crocodile (one leg sticking out)", "🧗"),
      o("d", "The Log (stiff as a board)", "🪵"),
    ],
  },
  {
    key: "battery-panic",
    ask: "At what battery percentage do I start sweating?",
    about: "At what battery percentage does {name} start sweating?",
    options: [
      o("a", "50% (I need full power)", "🪫"),
      o("b", "20% (Low power mode hits)", "⚠️"),
      o("c", "5% (I live dangerously)", "🔥"),
      o("d", "1% (Plugging in at the last second)", "🔌"),
    ],
  },
  {
    key: "fighting-skill",
    ask: "If a wild monkey attacked, what would I do?",
    about: "If a wild monkey attacked, what would {name} do?",
    options: [
      o("a", "Negotiate peace with food", "🍌"),
      o("b", "Scream and sprint away", "🏃"),
      o("c", "Try to fight it back", "🥊"),
      o("d", "Accept my fate", "🪦"),
    ],
  },
  {
    key: "secret-talent",
    ask: "What is my absolute useless superpower?",
    about: "What is {name}'s absolute useless superpower?",
    options: [
      o("a", "Knowing useless drama", "☕"),
      o("b", "Detecting food from miles away", "🍕"),
      o("c", "Overthinking simple texts", "🤯"),
      o("d", "Forgetting why I walked into a room", "🚪"),
    ],
  },
  {
    key: "voice-note",
    ask: "How long are the voice notes I send?",
    about: "How long are the voice notes {name} sends?",
    options: [
      o("a", "2-second grunt", "🔊"),
      o("b", "Normal 15 seconds", "💬"),
      o("c", "Full podcast (3+ minutes)", "🎙️"),
      o("d", "Never sends voice notes", "🚫"),
    ],
  },
  {
    key: "shopping-habit",
    ask: "When I add items to my online cart, what happens next?",
    about: "When {name} adds items to {his} cart, what happens next?",
    options: [
      o("a", "Buy everything instantly", "💳"),
      o("b", "Leave them there to rot forever", "🕸️"),
      o("c", "Close the app when shipping costs money", "🚚"),
      o("d", "Ask 10 friends for approval", "📱"),
    ],
  },
  {
    key: "shower-thought",
    ask: "What am I mostly doing in the shower?",
    about: "What is {name} mostly doing in the shower?",
    options: [
      o("a", "Winning imaginary arguments", "🗣️"),
      o("b", "Hosting a world-tour concert", "🎤"),
      o("c", "Staring at the wall contemplating life", "🧘"),
      o("d", "In and out in 2 minutes flat", "⚡"),
    ],
  },
  {
    key: "zombie-apocalypse",
    ask: "In a zombie outbreak, how long would I last?",
    about: "In a zombie outbreak, how long would {name} last?",
    options: [
      o("a", "First one to go", "🧟"),
      o("b", "A few days if I hide", "🙈"),
      o("c", "I'd become the zombie leader", "👑"),
      o("d", "Surviving till the very end", "🛡️"),
    ],
  },
  {
    key: "ghost-message",
    ask: "Why did I take 6 hours to reply to your text?",
    about: "Why did {name} take 6 hours to reply to a text?",
    options: [
      o("a", "Typed it out, forgot to hit send", "🤦"),
      o("b", "Was sleeping (as usual)", "🛌"),
      o("c", "Saw it, panicked, delayed it", "👁️"),
      o("d", "Was busy saving the world", "🦸"),
    ],
  },
];

export const QUESTION_BY_KEY: ReadonlyMap<string, Question> = new Map(QUESTIONS.map((q) => [q.key, q]));

export function getQuestion(key: string): Question | undefined {
  return QUESTION_BY_KEY.get(key);
}

export function getOption(question: Question, key: string): QuestionOption | undefined {
  return question.options.find((opt) => opt.key === key);
}

export function isOptionKey(value: unknown): value is OptionKey {
  return typeof value === "string" && (OPTION_KEYS as readonly string[]).includes(value);
}
