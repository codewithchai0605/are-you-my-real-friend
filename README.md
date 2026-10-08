# Are you my real friend? — "how well do your friends really know you?"

A funny friends quiz. **User 1** builds a quiz about themselves (name → gender → 10 questions),
gets a share link, and sends it to friends. Each **friend** answers the same 10 questions —
but in their **own random order**, with only **two options** per question (the true one + one
random decoy). Afterwards the friend is nudged to make their own quiz, and the owner sees a
leaderboard of who is a *real one* and who is a *fake friend* 🚩.

Turborepo · Next.js 16 (App Router, server-rendered) · Tailwind 4 · **Drizzle ORM + PostgreSQL**

## Quick start

```sh
bun install

# 1. a local Postgres (or point DATABASE_URL at Neon / Supabase / anything)
docker compose up -d

# 2. env
cp apps/web/.env.example apps/web/.env.local

# 3. create the tables
bun run db:migrate

# 4. go
bun run dev            # → http://localhost:3001
```

| Command               | What it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `bun run dev`         | Start everything in dev mode                                  |
| `bun run build`       | Production build                                              |
| `bun run check-types` | TypeScript checks (all packages)                              |
| `bun run lint`        | ESLint (zero warnings allowed)                                |
| `bun run db:generate` | Create a new SQL migration after editing `packages/db/src/schema.ts` |
| `bun run db:migrate`  | Apply migrations to `DATABASE_URL`                            |
| `bun run db:push`     | Sync schema straight to the DB (handy while prototyping)      |
| `bun run db:studio`   | Browse the data in Drizzle Studio                             |

`DATABASE_URL` lives in `apps/web/.env.local` and is shared by the app and by `drizzle-kit`.

## How the flow works

| Route                          | Rendered   | What happens                                                                 |
| ------------------------------ | ---------- | ---------------------------------------------------------------------------- |
| `/`                            | static     | Landing page. Shows a "your quizzes" shortcut if this browser made some.     |
| `/create`                      | static + client island | Name → gender → 10 questions (with **Skip** / **Back**), then saves. |
| `/q/[slug]/share`              | **server** | Share link, copy / WhatsApp / Telegram / native share.                       |
| `/q/[slug]`                    | **server** | Friend landing: "how well do you know *Sanjeet*?" + name field.              |
| `/q/[slug]/play/[attemptId]`   | **server** | The friend's own order + two options per question.                           |
| `/q/[slug]/done/[attemptId]`   | **server** | Score, rhyming verdict, and "now make your own quiz!".                       |
| `/q/[slug]/results`            | server shell + client | Owner-only leaderboard (see "identity" below).                    |

Every `/q/...` page streams a `loading.tsx` skeleton first, buttons show spinners while a
Server Action runs, and saving / grading shows a loader with rhyming messages.

### The `crypto.randomUUID()` in localStorage ("visitor id")

On first use the browser creates `crypto.randomUUID()` and keeps it in
`localStorage["dbm.visitor-id.v1"]` (`apps/web/lib/visitor.ts`). It is sent with every action and is used to:

- recognise the **quiz owner** when they come back (only they can open `/results`);
- allow **one attempt per browser** per quiz (re-opening the link resumes / shows your score).

It is a *soft* identity, not authentication — clearing site data or using a private window makes a "new person".
(It also falls back gracefully when `crypto.randomUUID` or `localStorage` is unavailable, e.g. plain-http LAN testing.)

### Different order + a random decoy per friend

When a friend presses **start**, the server (`startAttempt` in `apps/web/lib/server/quizzes.ts`):
shuffles the 10 questions with a secure RNG, picks one random **wrong** option per question as the decoy, randomly
decides which of the two shows first, and **saves all of it** (`attempt_questions`). Refreshing therefore never
reshuffles. The page props contain only the two options — **which one is correct never leaves the server**; answers are
graded in `submitAttempt`.

## Where things live

```
apps/web/
  app/                    routes, loading.tsx / error.tsx / not-found.tsx, actions.ts (Server Actions)
  components/             Shell, buttons, notebook card, option cards, loaders, skeletons, mascots
  lib/questions.ts        ← the question bank (edit this to add / reword questions)
  lib/copy.ts             ← all the rhymes: verdicts, loading messages, share text
  lib/server/quizzes.ts   all database logic
packages/db/              @repo/db — Drizzle schema, client, migrations (drizzle/)
```

### Editing questions

Edit `apps/web/lib/questions.ts`. Each question has a first-person `ask` (owner sees it) and a third-person
`about` (friends see it; tokens `{name} {he} {his} {him}`), plus 4 options. The database stores only the **keys**,
so rewording needs no migration. **Never rename or delete a `key`** once real quizzes exist.
The wizard asks for exactly 10 (`QUIZ_LENGTH` in `lib/constants.ts`) out of the bank — keep at least that many, ideally ~15 so **Skip** has room.

## Notes

- Use a **pooled** connection string on serverless hosts; the client sets `prepare: false` so it works with pgbouncer-style poolers.
- `NEXT_PUBLIC_APP_URL` is used for link-preview metadata; share links themselves use the real request host.
- The package manager is **bun** (see `devEngines` in `package.json`).
