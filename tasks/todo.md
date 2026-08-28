# Opti MVP Task Board

Status key: `[ ]` planned, `[~]` active, `[x]` complete, `[!]` blocked.

Only one primary implementation task should be active at a time.

## Foundation

- [x] [OPTI-001 — Define the generation contract](./tickets/OPTI-001-generation-contract.md)
- [x] [OPTI-002 — Replace Gemini with OpenRouter](./tickets/OPTI-002-openrouter-provider.md)
- [x] [OPTI-003 — Establish the Server Action boundary](./tickets/OPTI-003-server-action-boundary.md)

### Checkpoint: generation engine

- [x] OpenRouter-only generation passes contract and failure tests.
- [x] Legacy AI/RPC dependencies are removed.
- [x] Production build passes.

## Core workflows

- [ ] [OPTI-004 — Deliver the guest tailoring flow](./tickets/OPTI-004-guest-tailoring-flow.md)
- [ ] [OPTI-005 — Persist one master resume per account](./tickets/OPTI-005-master-resume-persistence.md)
- [ ] [OPTI-006 — Build the account master-resume experience](./tickets/OPTI-006-master-resume-experience.md)
- [ ] [OPTI-007 — Unify account generation with the saved master resume](./tickets/OPTI-007-account-generation.md)
- [ ] [OPTI-008 — Verify and finish PDF export](./tickets/OPTI-008-pdf-export.md)

### Checkpoint: functional MVP

- [ ] Guest can paste two inputs, preview, and download without an account.
- [ ] Account user can save one master resume and tailor from only a job description.
- [ ] Guest and generated data are not persisted.

## Product quality

- [ ] [OPTI-009 — Apply the sky design system and refine the workflow](./tickets/OPTI-009-ui-refinement.md)
- [ ] [OPTI-010 — Harden and verify the MVP release](./tickets/OPTI-010-mvp-hardening.md)

### Checkpoint: release candidate

- [ ] Automated checks and production build pass.
- [ ] Guest and account browser journeys pass on mobile and desktop.
- [ ] Privacy and failure-state checks pass.
- [ ] `staging` is ready for promotion to `main`.
