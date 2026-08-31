# OPTI-004: Deliver the guest tailoring flow

**Objective:** Let a visitor complete the core tailoring flow without creating an account.

**User value:** A first-time visitor can test the real product with no commitment.

## Scope

- Present master-resume and job-description text inputs to guests.
- Submit both values through the shared Server Action.
- Show clear idle, validation, generating, success, and retryable failure states.
- Render the validated tailored resume preview.
- Keep guest inputs and output in ephemeral client state only.

## Not included

- Browser persistence, file upload, account prompts that block generation, or UI polish beyond usability.

## Acceptance criteria

- [x] An unauthenticated visitor can generate and preview a tailored resume.
- [x] Refreshing or leaving the page does not persist guest resume, job description, or output.
- [x] Failures preserve the pasted inputs and allow retry.

## Verification

- [x] Component/action integration tests cover the primary states.
- [x] Manual guest journey succeeds in a signed-out browser session.
- [x] Lint, typecheck, and build pass.

**Audit status (2026-08-31):** Complete. The signed-out browser journey generated and rendered a validated tailored resume using the Infisical-configured OpenRouter provider.

**Dependencies:** OPTI-003
**Estimated scope:** Medium
**Likely areas:** generator page, wizard, intake/processing/deliverable components
