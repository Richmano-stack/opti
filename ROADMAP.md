# Opti MVP Roadmap

The executable implementation plan is [`tasks/plan.md`](./tasks/plan.md). Primary tickets and live status are tracked in [`tasks/todo.md`](./tasks/todo.md).

## Phase 0: Product alignment — complete

- Removed obsolete repository prompting systems and unrelated expense/organization code.
- Established the reusable-master-resume product direction.
- Cleaned unsupported marketing claims.
- Applied the cleanup database migration and verified the application build.

## Phase 1: Generation foundation

- Define the shared input/output contract.
- Replace Gemini with a direct OpenRouter integration.
- Replace tRPC generation with a Next.js Server Action.
- Remove unused transport and usage-tracking dependencies.

**Exit condition:** OpenRouter returns validated tailored-resume data through one simple server boundary.

## Phase 2: Both core workflows

- Deliver guest paste-tailor-preview behavior without persistence.
- Persist one raw-text master resume per authenticated user.
- Build master-resume setup and editing.
- Deliver job-description-only tailoring for returning users.

**Exit condition:** Guest and account modes both complete the core workflow, with only account master-resume text saved.

## Phase 3: Export and experience

- Verify selectable-text single-column PDF output.
- Apply the light sky-blue shadcn design system.
- Refine responsive layout, accessibility, and interaction states.

**Exit condition:** Both modes produce a dependable PDF through a coherent, modern interface.

## Phase 4: MVP hardening and release

- Audit privacy, logs, authentication boundaries, and failure handling.
- Add end-to-end coverage for guest and account journeys.
- Verify configuration, migrations, documentation, and production build.

**Exit condition:** `staging` is ready to promote to `main`.

## Deferred until after MVP

Generated history, file upload, multiple templates, DOCX export, billing, quotas, teams, analytics, job-board integrations, public APIs, and ATS scoring.
