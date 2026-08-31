# Opti

Opti turns one truthful master resume into a tailored PDF for each job application.

A guest can paste a resume and job description to try the complete flow without creating an account. An account user saves one master resume and only provides the job description on future applications. Generated resumes and PDFs are reviewed and downloaded immediately; they are not stored.

## Product principles

- The master resume is the factual source of truth.
- Tailoring may rephrase, prioritize, and reorder existing experience, but must not invent facts.
- Guest inputs and generated results remain ephemeral.
- Only an authenticated user's master-resume text is persisted in the MVP.
- File upload, generated history, multiple templates, and ATS scoring are intentionally deferred.

See [PRD.md](./PRD.md), [ROADMAP.md](./ROADMAP.md), and [tasks/plan.md](./tasks/plan.md) for the product contract and implementation plan.

## Stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS and shadcn-style UI primitives
- Next.js Server Actions
- OpenRouter through a small server-only `fetch` client
- Zod validation for user input and model output
- Better Auth
- PostgreSQL and Drizzle ORM
- React PDF
- Vitest
- Infisical for environment variables and secrets

## Requirements

- Node.js 20 or newer
- pnpm 11.20.0
- Docker Desktop, or another PostgreSQL instance
- Infisical CLI
- Access to the Opti project in Infisical

## Environment configuration

This repository is connected to the Opti Infisical project through `.infisical.json`. The file contains only non-secret project metadata and is safe to commit.

Configure these keys in the Infisical `dev` environment at secret path `/`:

```text
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
OPENROUTER_API_KEY
OPENROUTER_MODEL
OPENROUTER_APP_URL
OPENROUTER_APP_NAME
```

`.env.example` documents the expected variables without containing credentials. Local `.env` files remain ignored and are not required when commands run through Infisical.

Never export Infisical secrets into a repository file or commit credentials.

The development environment currently uses `OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free` so the core workflow can be exercised without paid credits. Free endpoints can be slower or rate-limited; choose a paid model before production quality evaluation.

## Local development

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Authenticate and connect the Infisical CLI if this is a new machine:

```bash
infisical login
infisical init
```

Start PostgreSQL (Docker exposes it on host port `5461` and forwards to container port `5432`):

```bash
pnpm db:up
```

Apply migrations with `DATABASE_URL` injected by Infisical:

```bash
pnpm db:migrate:infisical
```

Start Next.js with the development environment injected:

```bash
pnpm dev:infisical
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Next.js with Infisical's `dev` variables |
| `pnpm dev:next` | Start Next.js without Infisical injection (advanced/debugging only) |
| `pnpm build` | Create a production build using variables already present in the shell |
| `pnpm build:infisical` | Build with Infisical's `dev` variables |
| `pnpm start` | Run the production server |
| `pnpm test` | Run the Vitest suite |
| `pnpm lint` | Run ESLint |
| `pnpm exec tsc --noEmit` | Run TypeScript checking |
| `pnpm db:up` | Start local PostgreSQL with Docker Compose |
| `pnpm db:down` | Stop local PostgreSQL |
| `pnpm db:reset` | Delete and recreate the local PostgreSQL volume |
| `pnpm db:generate` | Generate a Drizzle migration |
| `pnpm db:migrate:infisical` | Apply migrations with Infisical's `dev` variables |
| `pnpm db:studio:infisical` | Open Drizzle Studio with Infisical's `dev` variables |

`pnpm db:reset` permanently deletes the local Docker database volume.

For one-off commands, use the same injection pattern:

```bash
infisical run --env=dev --path=/ -- pnpm <command>
```

## Architecture

```text
Guest
  resume text + job description
             \
              -> Server Action -> OpenRouter -> Zod validation -> preview -> PDF download
             /
Account user
  saved master resume + job description

PostgreSQL stores authentication data and one master resume per account.
Guest inputs, tailored results, and PDFs are not persisted.
```

Important directories:

| Path | Responsibility |
| --- | --- |
| `src/app` | App Router pages, layouts, API handlers, and Server Actions |
| `src/components/guest` | Signed-out tailoring workflow |
| `src/components/master-resume` | Saved master-resume editor |
| `src/components/pdf` | Selectable-text PDF rendering and download |
| `src/services/ai` | Generation contract and OpenRouter provider |
| `src/services/master-resume` | Authenticated master-resume persistence |
| `src/server/auth` | Better Auth configuration |
| `src/db` | Drizzle schema, database client, and migrations |
| `tasks` | Implementation plan and primary task tickets |

## Privacy and AI safety

- Resume content and job descriptions are untrusted input.
- OpenRouter credentials remain server-only.
- Model output is parsed and validated before rendering.
- Authenticated persistence derives ownership from the server session.
- Application errors do not expose credentials or resume content.
- Opti does not promise ATS passage, interviews, or employment outcomes.

## Development workflow

- `main` is the production baseline.
- `staging` is the integration branch.
- Short-lived feature branches merge into `staging` through pull requests.
- Before review, run tests, lint, TypeScript checking, and a production build.

Current progress and outstanding verification work are tracked in [tasks/todo.md](./tasks/todo.md).

## License

No license has been selected. The repository remains all rights reserved.
