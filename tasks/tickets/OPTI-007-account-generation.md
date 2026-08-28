# OPTI-007: Unify account generation with the saved master resume

**Objective:** Make signed-in generation load the user's saved master resume server-side so the user supplies only a job description.

**User value:** Returning users get the product's core convenience: save once, tailor repeatedly.

## Scope

- Detect the authenticated mode on the server.
- Load the current user's master resume rather than accepting source text from the client.
- Present only the job-description input to users with a saved master resume.
- Redirect or guide users without a master resume to setup.
- Reuse the same generation service and result UI as guest mode.

## Not included

- Generated history, saved job descriptions, quotas, or separate AI behavior by mode.

## Acceptance criteria

- [ ] A returning user with a saved master resume generates from only a pasted job description.
- [ ] The action cannot be made to use another user's master resume.
- [ ] Guest and account generation share one output contract and provider path.

## Verification

- [ ] Integration tests cover authenticated success, missing master resume, and ownership isolation.
- [ ] Manual returning-user journey succeeds.
- [ ] Lint, typecheck, and build pass.

**Dependencies:** OPTI-003, OPTI-006
**Estimated scope:** Medium
**Likely areas:** generation action, dashboard generator route, generator components
