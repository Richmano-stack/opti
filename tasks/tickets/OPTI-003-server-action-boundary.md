# OPTI-003: Establish the Server Action boundary

**Objective:** Expose tailoring through one validated Next.js Server Action and retire the legacy RPC transport.

**User value:** Both product modes use one simple, secure generation path.

## Scope

- Add a Server Action that validates input and calls the OpenRouter-backed tailoring service.
- Return a small discriminated success/error result suitable for the UI.
- Replace the current generator's tRPC call with the action.
- Remove unused tRPC routers, handlers, providers, TanStack Query, SuperJSON, and associated dependencies after callers are gone.
- Remove obsolete usage tracking and generated-resume persistence from the generation path.

## Not included

- Master-resume persistence, final guest UX, or visual redesign.

## Acceptance criteria

- [ ] A valid request returns a validated tailored resume through the Server Action.
- [ ] Invalid input and provider failures return safe, actionable errors.
- [ ] tRPC, TanStack Query, SuperJSON, usage tracking, and generated-output persistence are absent from runtime code and dependencies.

## Verification

- [ ] Action tests cover success, validation failure, and provider failure.
- [ ] Stale-reference search is empty for removed libraries and routes.
- [ ] Lint, typecheck, and build pass.

**Dependencies:** OPTI-002
**Estimated scope:** Medium; split cleanup into a second commit within the same PR if needed
**Likely areas:** server actions, generator client, legacy server/router files, `package.json`
