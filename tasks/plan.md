# Implementation Plan: Opti MVP

## Objective

Ship one dependable workflow: a user supplies a truthful master resume and a job description, reviews an AI-tailored resume, and downloads a clean PDF.

The MVP launches with both modes:

- **Guest:** paste master resume and job description for the current session; nothing is saved.
- **Account:** save one master resume, then paste only a job description on future visits.

Generated resumes and PDFs are not persisted. File upload, history, billing, teams, templates, and ATS scoring are outside the MVP.

## Delivery method

- Work through the numbered tasks in dependency order.
- One primary task maps to one short-lived `codex/<task-name>` branch and one PR into `staging`.
- Keep each PR focused on its acceptance criteria; do not perform unrelated cleanup.
- Merge stable batches from `staging` into `main` for release.
- Update `tasks/todo.md` when a task starts or finishes.

## Architecture decisions

- Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn remain the application stack.
- Next.js Server Actions are the application boundary; tRPC, TanStack Query, and SuperJSON will be removed once no caller depends on them.
- OpenRouter is the only AI provider. Use a small server-only client built on `fetch`; do not add an AI SDK.
- `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` are required server-side configuration. Optional attribution headers use `OPENROUTER_APP_URL` and `OPENROUTER_APP_NAME`.
- Zod validates user input and the model's structured output.
- Better Auth provides email/password accounts. Guest use requires no account.
- PostgreSQL and Drizzle store authentication data and one raw-text master resume per user.
- Generated resume data remains in the current browser flow long enough to preview and download; it is not written to the database.
- React PDF produces a selectable-text, single-column PDF in the browser.
- The light sky-blue shadcn token system is the visual foundation.

## Dependency path

```text
Generation contract
  -> OpenRouter adapter
    -> Server Action and legacy transport removal
      -> Guest workflow
      -> Saved master resume
        -> Account workflow
          -> PDF verification
            -> UI refinement
              -> privacy, reliability, and release verification
```

## Primary tasks

| ID | Task | Outcome | Depends on |
| --- | --- | --- | --- |
| OPTI-001 | Generation contract | Stable validated input/output boundary | None |
| OPTI-002 | OpenRouter provider | Tailoring works through OpenRouter | OPTI-001 |
| OPTI-003 | Server Action boundary | Simple generation entry point; legacy RPC removed | OPTI-002 |
| OPTI-004 | Guest tailoring flow | No-account users can tailor and preview | OPTI-003 |
| OPTI-005 | Master resume persistence | One isolated saved resume per account | OPTI-001 |
| OPTI-006 | Account master resume experience | Users can create and edit saved source text | OPTI-005 |
| OPTI-007 | Unified account generation | Returning users tailor from saved source text | OPTI-003, OPTI-006 |
| OPTI-008 | PDF export quality | Both modes download a dependable PDF | OPTI-004, OPTI-007 |
| OPTI-009 | Product UI refinement | Complete workflow uses the sky design system | OPTI-004, OPTI-007, OPTI-008 |
| OPTI-010 | MVP hardening and release | Privacy, failure handling, and both paths verified | OPTI-009 |

Detailed tickets live in [`tasks/tickets`](./tickets/).

## Checkpoints

### Generation engine — after OPTI-003

- OpenRouter is the only AI integration.
- Invalid model output cannot reach the renderer.
- One Server Action exposes generation to the UI.
- Legacy Gemini and tRPC generation code is gone.

### Functional MVP — after OPTI-008

- Guest and account paths both work end to end.
- Only account master-resume text is persisted.
- Generated data can be previewed and downloaded but is not stored.
- Exported PDF text is selectable and follows a single-column order.

### Release candidate — after OPTI-010

- Responsive UI uses the approved visual direction.
- Sensitive resume or job-description content is absent from logs.
- Expected failures are understandable and retryable.
- Automated checks, production build, and manual browser journeys pass.

## Project-wide definition of done

Every task must satisfy all of the following:

- Acceptance criteria in its ticket are met.
- Relevant automated tests are added or updated.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass.
- Manual verification listed in the ticket is completed.
- No secrets, resume content, or job-description content are committed or logged.
- Documentation and `tasks/todo.md` reflect any changed decision or status.

## Main risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Model invents facts | High | Ground the prompt in source text, require structured output, validate it, and retain human review before export. |
| OpenRouter model output varies | High | Make the model configurable, validate responses, normalize errors, and test malformed responses. |
| Resume text leaks through storage or logs | High | Persist only authenticated master resumes; never log inputs or outputs; never persist guest/generated data. |
| PDF differs from preview | Medium | Test the same structured resume fixture against preview and PDF output; manually inspect rendered pages. |
| Cleanup breaks the working flow | Medium | Replace callers before removing legacy dependencies and verify after each task. |
| UI work expands the MVP | Medium | Refine only the core workflow; do not add templates, dashboards, scores, or history. |

## Decisions intentionally deferred

- Which OpenRouter model becomes the production default; it remains environment-configurable until quality/cost evaluation.
- File upload and document parsing.
- Generated-resume history or cloud PDF storage.
- Multiple master resumes or PDF templates.
- Billing, quotas, teams, public APIs, and job-board integrations.
- ATS scoring or promises of interview outcomes.
