# OPTI-010: Harden and verify the MVP release

**Objective:** Close privacy, reliability, and release-readiness gaps across the completed guest and account workflows.

**User value:** The product behaves safely and predictably when real inputs, failures, and devices are involved.

## Scope

- Audit logs, errors, and persistence for resume and job-description leakage.
- Confirm OpenRouter timeouts, rate limits, malformed responses, and unavailable-service states are actionable and retryable.
- Add end-to-end coverage for the guest and account happy paths plus critical failures.
- Verify authentication boundaries, security headers, environment documentation, migrations, and production build.
- Update README setup and release instructions to match the implemented product.

## Not included

- Billing, analytics platforms, enterprise observability, history, or features deferred by the plan.

## Acceptance criteria

- [ ] Guest and generated content is never persisted; only authenticated master-resume text is stored.
- [ ] No sensitive input/output appears in application logs or user-facing technical errors.
- [ ] Both primary browser journeys and critical failure tests pass against a production build.

## Verification

- [ ] Full automated suite, lint, typecheck, migration check, and production build pass.
- [ ] Manual privacy and responsive-browser checklist passes.
- [ ] `staging` is documented as ready for promotion to `main`.

**Dependencies:** OPTI-009
**Estimated scope:** Medium
**Likely areas:** tests, error handling, security/configuration, README
