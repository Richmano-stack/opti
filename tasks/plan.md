# Implementation Plan: Phase 0 Product Alignment

## Overview

Align Opti with its actual concept: save one truthful master resume, paste a job description for each application, and receive a tailored PDF. Preserve the working resume-generation path while removing unrelated expense infrastructure and unsupported marketing claims.

## Architecture decisions

- Keep individual authentication; defer organization and team tenancy.
- Keep the Gemini pipeline, structured resume type, preview, persistence, and PDF renderer.
- Preserve migration history and use a forward cleanup migration.
- Do not advertise pricing, testimonials, scores, templates, or enterprise features until implemented.

## Tasks

1. Establish the product contract in `PRD.md` and `ROADMAP.md`.
2. Remove organization, membership, category, and transaction runtime code.
3. Generate a forward migration that removes obsolete database objects.
4. Remove unsupported landing-page claims and explain the save-once workflow.
5. Run stale-reference searches, typecheck, lint, and production build.

## Risks

- Preserve Better Auth's user, session, account, and verification tables while removing its organization plugin.
- Do not rewrite old migrations that may already be deployed.
- Do not remove `src/services/ai`; it is core product runtime.
- Treat the current two-input generator as a temporary implementation gap, not dead code.

## Open questions for Phase 1

- Should initial master-resume intake support pasted text only or file upload too?
- Should users edit raw source text, structured fields, or both?
- How should company and role labels be derived for history?