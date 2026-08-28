# Opti Product Roadmap

## Current baseline

The repository contains authentication, a Gemini-backed resume transformation pipeline, structured validation, generated-resume persistence, preview, and PDF export. The current generator still asks for the source resume and job description on every run.

## Phase 0: Product alignment and cleanup

Goal: establish one product direction and remove unrelated or misleading functionality without breaking resume generation.

- [x] Remove obsolete repository-level agent instructions.
- [x] Replace the old requirements with the master-resume product definition.
- [x] Remove organization-scoped expense and transaction functionality.
- [x] Remove unsupported pricing, enterprise, testimonial, scoring, and template claims.
- [x] Verify typecheck, lint, and production build.

Exit condition: the repository describes only the reusable-master-resume product, contains no unrelated expense domain, and builds successfully.

## Phase 1: Master resume foundation

- Add a user-owned `master_resumes` model.
- Store original source text and a validated structured profile.
- Add create, retrieve, and update procedures.
- Build first-time setup and an editing screen.
- Verify user data isolation.

Exit condition: a user can save, review, edit, and later retrieve a master resume.

## Phase 2: Job-description-only generation

- Replace the two-input generator with job-description intake.
- Load the authenticated user's master resume on the server.
- Ground generation exclusively in that master resume.
- Store the job description with each generated resume.
- Retain preview and PDF export.

Exit condition: a returning user can paste a job description and download a tailored PDF without re-entering resume content.

## Phase 3: Application history

- Add a generated-resume history screen.
- Open, re-download, and delete previous outputs.
- Show useful job and company labels when reliably derivable.

## Phase 4: Quality and trust

- Show which master-resume facts support generated claims.
- Flag uncertain output before export.
- Improve generation retries and malformed-output handling.
- Add tests for factual preservation and user isolation.
- Add observability without logging private resume content.

## Deferred decisions

Subscriptions, multiple master resumes, multiple templates, DOCX export, team accounts, job-board integrations, and ATS scoring methodology remain deferred and must not be marketed as available.