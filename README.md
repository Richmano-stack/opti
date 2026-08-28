# Opti

Opti turns one reusable master resume into a tailored PDF resume for each job application.

Instead of repeatedly pasting the same career history into a general-purpose AI chat, a user saves their standard resume once. For every new application, they provide the job description, review a truthful AI-tailored result, and download a clean PDF.

## Product workflow

```text
Save master resume once
          ↓
Paste a job description
          ↓
Generate a tailored resume
          ↓
Review and download the PDF
          ↓
Return to it in application history
```

Opti treats the master resume as the factual source of truth. Generated resumes may rephrase, prioritize, and reorder existing experience, but must not invent employers, roles, dates, education, skills, certifications, or metrics.

## Current status

The repository currently provides:

- Email/password and magic-link authentication with Better Auth
- A Gemini-backed structured resume transformation pipeline
- Runtime validation of generated resume data with Zod
- User-owned generated-resume persistence with PostgreSQL and Drizzle
- A resume preview and single-column PDF export
- A Next.js landing page and authenticated generator flow

The generator still asks for both resume text and a job description on each run. The next milestone is to introduce persistent master-resume storage so returning users only submit a job description.

See [PRD.md](./PRD.md) for the product contract and [ROADMAP.md](./ROADMAP.md) for planned development.

## Technology

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS and shadcn/ui primitives
- tRPC and TanStack Query
- PostgreSQL and Drizzle ORM
- Better Auth
- Google Gemini via `@google/generative-ai`
- `@react-pdf/renderer`
- Zod

## Quick start

### Requirements

- Node.js 20 or newer
- npm
- Docker Desktop, or another PostgreSQL 16 instance
- A Gemini API key for resume generation

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Copy `.env.example` to `.env.local` and provide the required values:

```dotenv
DATABASE_URL=postgresql://opti:opti@localhost:5432/opti
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
GEMINI_API_KEY=replace-with-your-gemini-api-key
```

Never commit `.env.local` or production credentials.

### 3. Start PostgreSQL

```bash
npm run db:up
```

### 4. Apply database migrations

```bash
npm run db:migrate
```

### 5. Start the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run db:up` | Start local PostgreSQL with Docker Compose |
| `npm run db:down` | Stop local PostgreSQL |
| `npm run db:reset` | Delete and recreate the local database volume |
| `npm run db:generate` | Generate a Drizzle migration from the schema |
| `npm run db:migrate` | Apply pending database migrations |
| `npm run db:push` | Push the current schema directly to the configured database |
| `npm run db:studio` | Open Drizzle Studio |

`npm run db:reset` permanently deletes the local Docker database volume.

## Architecture

```text
Browser
  ├─ Next.js App Router pages and React components
  ├─ tRPC React client
  └─ Client-side PDF rendering
          │
          ▼
tRPC server
  ├─ Better Auth session context
  ├─ Resume procedures
  └─ Usage queries
          │
          ├─ Gemini structured generation
          └─ Drizzle ORM → PostgreSQL
```

Important directories:

| Path | Responsibility |
| --- | --- |
| `src/app` | Next.js routes, layouts, and API handlers |
| `src/components/generator` | Resume-generation workflow and preview |
| `src/components/pdf` | Single-column PDF document and download logic |
| `src/services/ai` | Gemini prompts, schemas, validation, and service errors |
| `src/server` | tRPC context, routers, and authentication integration |
| `src/db` | Drizzle schema, database client, and migrations |

The current request path is:

```text
resume + job description
  → protected tRPC mutation
  → Gemini structured JSON
  → Zod validation
  → PostgreSQL JSONB
  → preview
  → client-generated PDF
```

## AI and resume safety

- Resume content and job descriptions are untrusted user input.
- Gemini is instructed to preserve factual employment and education data.
- Generated JSON is validated before it is saved or rendered.
- The application must not claim guaranteed ATS passage or employment outcomes.
- Production observability must not log private resume content.

## Database notes

The local Docker configuration exposes PostgreSQL on port `5432` and persists data in a named Docker volume.

Migrations are stored in `src/db/migrations`. Prefer generated, forward migrations over modifying migrations that may already have been applied.

## Development workflow

- `main` is the production baseline.
- `staging` is the integration branch.
- Feature branches should be short-lived and merged into `staging` through pull requests.
- Run lint, TypeScript checking, and a production build before marking a pull request ready for review.

## Next milestone

Phase 1 introduces a user-owned master resume:

1. Save and retrieve one master resume per user.
2. Review and edit its structured content.
3. Load it on the server during generation.
4. Change the recurring generator to accept only a job description.
5. Associate every generated resume with its source master resume and job description.

## License

No license has been selected yet. Until one is added, the repository remains all rights reserved.
